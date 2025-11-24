import { useCallback, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import type { CardInfo } from './interfaces';
import { formatCardNumber, formatExpiry, getCardInfo, getBrowserInfo } from './helpers';
import AnimatedCardFlip from '../FlipCard';
import ShadowInput from '../shadowInput';
import type { UserInfoAdd } from '../../services/interfaces/addCard.interface';

import {
  validateCardNumber,
  validateHolderName,
  validateExpiryDate,
  validateSecurityCode,
  validateOTPCode
} from './validations';
import { t } from '../../i18n';
import type { OtpResponse } from '../../services/interfaces/otp.interface';
import ChallengeModal from '../../hooks/AddCardHook/Verify3dsHook';

import type { ErrorModel } from '../../interfaces';
import { addCard } from '../../services/cards/Add.card';
import { verify } from '../../services/transactions/verify.transaction';
import type { BrowserResponse } from '../../services/interfaces/generic.interface';
import {
  confirmCres,
  createCresReference,
  cresGetData,
  loginCres
} from '../../services/cres/cres.service';
import Environment from '../../environment/environment';

export interface PaymentGatewayFormProps {
  userInfo: UserInfoAdd;
  showHolderName?: boolean;
  theme?: {
    buttonColor?: string;
    buttonTextColor?: string;
    labelColor?: string;
    inputTextColor?: string;
    errorColor?: string;
  };
  onSuccess?: (succes: boolean, message: string) => void;
  onVerifyOtp?: (response: OtpResponse) => void;
  onError?: (response: ErrorModel) => void;
  onLoading?: (isLoading: boolean) => void;
  moreInfoOtp?: boolean;
}

const POLL_INTERVAL_MS = 5000;

const PaymentGatewayForm = ({
  userInfo,
  showHolderName = true,
  theme = {},
  onSuccess,
  onError,
  onVerifyOtp,
  onLoading,
  moreInfoOtp = true
}: PaymentGatewayFormProps) => {
  // FORM INPUTS
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [dateExpiry, setDateExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // UI / small states
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | undefined>();
  const [challengeHtml, setChallengeHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verifyByOtp, setVerifyByOtp] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [validateBy3ds, setValidateBy3ds] = useState(false);

  // Mutable refs to avoid race conditions
  const tokenRef = useRef<string | null>(null);
  const cresReferenceRef = useRef<string | null>(null);
  const transactionRefRef = useRef<string | null>(null);

  // Polling refs
  const isFetchingCresRef = useRef(false);
  const cresIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ------------ Helpers / small hooks ------------
  const handleCardNumber = useCallback((value: string) => {
    const result = formatCardNumber(value);
    setCardNumber(result);
    setCardInfo(getCardInfo(result));
  }, []);

  const handleExpiryChange = useCallback((value: string) => {
    setDateExpiry(formatExpiry(value));
  }, []);

  const isCardFormValid =
    !validateCardNumber(cardNumber) &&
    !validateHolderName(cardholderName, showHolderName) &&
    !validateExpiryDate(dateExpiry) &&
    !validateSecurityCode(securityCode, cardInfo?.cvcNumber);

  const isOtpFormValid = verifyByOtp ? !validateOTPCode(otpCode) : true;
  const isFormValid = verifyByOtp ? isOtpFormValid : isCardFormValid;

  // ------------- CRES Polling (uses refs) --------------
  const startCresPolling = useCallback((token: string, id: string, onFound: (cres: string) => void) => {
    if (cresIntervalRef.current) return;
    cresIntervalRef.current = setInterval(async () => {
      if (isFetchingCresRef.current) return;
      isFetchingCresRef.current = true;
      try {
        const res = await cresGetData(token, id);
        if (res?.data?.cres) {
          stopCresPolling();
          // confirmCres before using value (as your original flow)
          const saved = await confirmCres(token, id);
          if (saved) {
            onFound(res.data.cres);
          } else {
            // fallback: still call onFound if needed
            onFound(res.data.cres);
          }
        }
      } catch (err) {
        stopCresPolling();
      } finally {
        isFetchingCresRef.current = false;
      }
    }, POLL_INTERVAL_MS);
  }, []);

  const stopCresPolling = useCallback(() => {
    if (cresIntervalRef.current) {
      clearInterval(cresIntervalRef.current);
      cresIntervalRef.current = null;
    }
    isFetchingCresRef.current = false;
  }, []);

  // -------------- Flow functions ----------------
  const clearAllForms = useCallback(() => {
    setCardNumber('');
    setCardholderName('');
    setDateExpiry('');
    setSecurityCode('');
    setOtpCode('');
    setIsOtpValid(true);
    setVerifyByOtp(false);
    setCardInfo(undefined);
  }, []);

  const verifyBy3dsProcess = useCallback(
    async (browserResponse: BrowserResponse | undefined, trxRef: string) => {
      if (!trxRef) {
        onError?.({
          error: { type: 'Missing transaction', help: '', description: 'transactionRef is required for 3DS' }
        });
        return;
      }

      try {
        if (browserResponse?.challenge_request) {
          setIsLoading(false);
          onLoading?.(false);
          setChallengeHtml(browserResponse.challenge_request);
          setValidateBy3ds(true);
          if (tokenRef.current && cresReferenceRef.current) {
            startCresPolling(tokenRef.current, cresReferenceRef.current, (cresValue) => {
            
              challengeValidationCres(cresValue, trxRef);
            });
          } else {
            onError?.({
              error: { type: '3DS', help: '', description: 'CRES token/ref not available' }
            });
          }
          return;
        }
        await new Promise((r) => setTimeout(r, 5000));
        const response = await verify({
          user: { id: userInfo.id },
          transaction: { id: trxRef },
          value: '',
          type: 'AUTHENTICATION_CONTINUE',
          more_info: moreInfoOtp
        });
        
        switch (response.transaction?.status) {
          case 'success':
            onVerifyOtp?.(response);
            setIsLoading(false);
            onLoading?.(false);
            clearAllForms();
            break;
          case 'pending':
            
            verifyBy3dsProcess(response['3ds']?.browser_response, trxRef);
            break;
          case 'failure':
            onVerifyOtp?.(response);
            setIsLoading(false);
            onLoading?.(false);
            break;
          default:
            onError?.({
              error: { type: '3DS', help: '', description: 'Unexpected status' }
            });
            setIsLoading(false);
            onLoading?.(false);
            break;
        }
      } catch (err: any) {
        onLoading?.(false);
        setIsLoading(false);
        onError?.(err?.error ?? { error: { type: '3DS', help: '', description: String(err) } });
      } finally {
        
      }
    },
    [clearAllForms, moreInfoOtp, onError, onLoading, onVerifyOtp, startCresPolling, userInfo.id]
  );

  const challengeValidationCres = useCallback(
    async (cresValue: string, trxRef: string) => {
      try {
        setValidateBy3ds(false);
        setIsLoading(true);
        onLoading?.(true);
        const response = await verify({
          user: { id: userInfo.id },
          transaction: { id: trxRef },
          value: cresValue,
          type: 'BY_CRES',
          more_info: moreInfoOtp
        });
        onVerifyOtp?.(response);
        setIsLoading(false);
        onLoading?.(false);
        clearAllForms();
      } catch (err: any) {
        setIsLoading(false);
        onLoading?.(false);
        onError?.(err);
      } finally {
        stopCresPolling();
      }
    },
    [clearAllForms, moreInfoOtp, onError, onLoading, onVerifyOtp, stopCresPolling, userInfo.id]
  );

  const handleVerifyOtp = useCallback(async () => {
    if (!transactionRefRef.current) {
      onError?.({ error: { type: 'Missing transaction', help: '', description: 'transactionRef missing' } });
      return;
    }
    try {
      setIsLoading(true);
      onLoading?.(true);
      const response = await verify({
        user: { id: userInfo.id },
        transaction: { id: transactionRefRef.current },
        value: otpCode,
        type: 'BY_OTP',
        more_info: moreInfoOtp
      });
      switch (response.transaction?.status_detail) {
        case 31:
          setOtpCode('');
          setIsOtpValid(false);
          break;
        case 32:
          setIsOtpValid(true);
          onVerifyOtp?.(response);
          clearAllForms();
          break;
        case 33:
          clearAllForms();
          onVerifyOtp?.(response);
          break;
        default:
          setOtpCode('');
          setIsOtpValid(false);
          break;
      }
    } catch (err: any) {
      onError?.(err);
    } finally {
      setIsLoading(false);
      onLoading?.(false);
    }
  }, [clearAllForms, moreInfoOtp, onError, onLoading, onVerifyOtp, otpCode, userInfo.id]);

  // ------------- Main add card flow -------------
  const handleAddCard = useCallback(async () => {
    if (!isFormValid) return;
    onLoading?.(true);
    setIsLoading(true);

    try {
      const [monthStr, yearStr] = dateExpiry.split('/');
      const month = parseInt(monthStr!, 10);
      const year = 2000 + parseInt(yearStr!, 10);

      // Login CRES and create reference if needed
      const respLogin = await loginCres(Environment.getInstance().clientId, Environment.getInstance().clientSecret);
      if (respLogin) {
        tokenRef.current = respLogin.access_token;
        const respCresRef = await createCresReference(tokenRef.current);
        if (respCresRef) {
          cresReferenceRef.current = respCresRef.id;
        }
      }

      const browserInfo = await getBrowserInfo();
      const response = await addCard({
        user: userInfo,
        card: {
          number: cardNumber.replace(/\s/g, ''),
          holder_name: cardholderName,
          expiry_month: month,
          expiry_year: year,
          cvc: securityCode,
          type: cardInfo?.typeCode
        },
        extra_params: {
          threeDS2_data: {
            term_url: `https://nuvei-cres-dev-bkh4atahdegxa8dk.eastus-01.azurewebsites.net/api/cres/save/${cresReferenceRef.current ?? ''}`,
            device_type: 'browser'
          },
          browser_info: browserInfo
        }
      });

      // Always take transaction ref from response.card.transaction_reference
      const trxRef = response?.card?.transaction_reference;
      if (trxRef) {
        transactionRefRef.current = trxRef;
      }

      // Handle different status_detail
      switch (response?.transaction?.status_detail) {
        case 7:
          onLoading?.(false);
          setIsLoading(false);
          if (response.card.status === 'valid') {
            onSuccess?.(true, 'Card Added Successfully');
          } else {
            onSuccess?.(false, `Card Status: ${response.card.status}`);
          }
          clearAllForms();
          break;

        case 9:
          onLoading?.(false);
          setIsLoading(false);
          onSuccess?.(false, `Card Status: ${response.card.status}`);
          break;

        case 31:
          // OTP required
          setVerifyByOtp(true);
          // ensure transactionRefRef is set (we passed it above)
          onLoading?.(false);
          setIsLoading(false);
          break;

        case 36:
        case 35:
          // 3DS flow: pass trxRef directly to avoid setState race
          await verifyBy3dsProcess(response['3ds']?.browser_response, trxRef ?? '');
          break;

        default:
          onError?.({
            error: { type: 'Error in request', help: '', description: 'Error in request' }
          });
          onLoading?.(false);
          setIsLoading(false);
          break;
      }
    } catch (err) {
      onLoading?.(false);
      setIsLoading(false);
      console.log("Error")
      onError?.(err as ErrorModel ?? { error: { type: 'network', help: '', description: String(err) } });
    } finally {
      // don't clear all forms here, because OTP / 3DS flows need data to remain.
      // clearAllForms() should be called only on success/terminal conditions
    }
  }, [
    cardNumber,
    cardInfo?.typeCode,
    cardholderName,
    clearAllForms,
    isFormValid,
    securityCode,
    userInfo,
    verifyBy3dsProcess,
    onError,
    onLoading,
    onSuccess
  ]);

  // -------------- Button handler (decide which flow) -------------
  const handlePress = useCallback(() => {
    if (!isFormValid || isLoading) return;
    if (verifyByOtp) {
      void handleVerifyOtp();
    } else {
      void handleAddCard();
    }
  }, [handleAddCard, handleVerifyOtp, isFormValid, isLoading, verifyByOtp]);

  // -------------- Render -------------
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ChallengeModal visible={validateBy3ds} onClose={() => {}} onSuccess={() => {}} challengeHtml={challengeHtml} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
        <AnimatedCardFlip
          isFlipped={isFlipped}
          cardNumber={cardNumber || '**** **** **** ****'}
          cardHolderName={cardholderName || 'Jhon Doe'}
          expiryDate={dateExpiry || 'MM/YY'}
          ccv={securityCode || '***'}
          gradient={cardInfo?.gradientColor || ['#333', '#000']}
          icon={
            cardInfo?.icon ||
            'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true'
          }
        />

        <ShadowInput
          label={t('forms.cardNumber')}
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChangeText={handleCardNumber}
          maxLength={19}
          editable={!verifyByOtp}
          keyboardType="numeric"
          allowedChars={/^[0-9 ]*$/}
          setIsFlipped={setIsFlipped}
          isFlipped={false}
          validation={(v) => validateCardNumber(v)}
          labelStyle={{ color: theme.labelColor || '#000' }}
          inputStyle={{ color: theme.inputTextColor || '#000' }}
          errorStyle={{ color: theme.errorColor || 'red' }}
        />

        {showHolderName && (
          <ShadowInput
            label={t('forms.holderName')}
            placeholder="John Doe"
            forceUppercase
            value={cardholderName}
            editable={!verifyByOtp}
            onChangeText={setCardholderName}
            maxLength={20}
            validation={(v) => validateHolderName(v, showHolderName)}
            setIsFlipped={setIsFlipped}
            isFlipped={false}
            allowedChars={/^[A-Za-z ]*$/}
            labelStyle={{ color: theme.labelColor || '#000' }}
            inputStyle={{ color: theme.inputTextColor || '#000' }}
            errorStyle={{ color: theme.errorColor || 'red' }}
          />
        )}

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ShadowInput
              label={t('forms.expiryDate')}
              placeholder="MM/YY"
              value={dateExpiry}
              editable={!verifyByOtp}
              onChangeText={handleExpiryChange}
              maxLength={5}
              keyboardType="numeric"
              validation={(v) => validateExpiryDate(v)}
              setIsFlipped={setIsFlipped}
              isFlipped={false}
              labelStyle={{ color: theme.labelColor || '#000' }}
              inputStyle={{ color: theme.inputTextColor || '#000' }}
              errorStyle={{ color: theme.errorColor || 'red' }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <ShadowInput
              label={t('forms.securityCode')}
              placeholder="CCV/CVV"
              value={securityCode}
              editable={!verifyByOtp}
              onChangeText={setSecurityCode}
              maxLength={cardInfo?.cvcNumber || 3}
              keyboardType="numeric"
              validation={(v) => validateSecurityCode(v, cardInfo?.cvcNumber)}
              setIsFlipped={setIsFlipped}
              isFlipped
              labelStyle={{ color: theme.labelColor || '#000' }}
              inputStyle={{ color: theme.inputTextColor || '#000' }}
              errorStyle={{ color: theme.errorColor || 'red' }}
            />
          </View>
        </View>

        {verifyByOtp && (
          <ShadowInput
            label={t('forms.otpCode')}
            placeholder="123456"
            value={otpCode}
            onChangeText={setOtpCode}
            maxLength={6}
            setIsFlipped={setIsFlipped}
            validation={(v) => validateOTPCode(v, isOtpValid)}
            isFlipped={false}
            allowedChars={/^[0-9 ]*$/}
            labelStyle={{ color: theme.labelColor || '#000' }}
            inputStyle={{ color: theme.inputTextColor || '#000' }}
            errorStyle={{ color: theme.errorColor || 'red' }}
          />
        )}

        {!isOtpValid && <Text style={{ color: theme.errorColor || 'red' }}>{t('errors.otpNotValid')}</Text>}

        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.buttonColor || '#000' },
            (!isFormValid && styles.disabledButton) || (isLoading && styles.disabledButton)
          ]}
          onPress={handlePress}
          disabled={!isFormValid || isLoading}
        >
          <Text style={{ color: theme.buttonTextColor || '#fff', textAlign: 'center' }}>
            {verifyByOtp ? 'Verify Code' : 'Add Card'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 8 },
  button: { marginTop: 16, paddingVertical: 12, borderRadius: 8 },
  disabledButton: { backgroundColor: '#888' },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  webView: { justifyContent: 'center', marginTop: 60, borderRadius: 20, padding: 20, marginBottom: 20 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

export default PaymentGatewayForm;
