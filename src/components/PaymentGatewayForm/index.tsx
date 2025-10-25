import {  useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet, Button, Dimensions } from 'react-native';
import type { CardInfo } from './interfaces';
import { formatCardNumber, formatExpiry, getCardInfo, getBrowserInfo } from './helpers';
import AnimatedCardFlip from '../FlipCard';
import ShadowInput from '../shadowInput';
import { type AddCardResponse, type UserInfoAdd } from '../../services/interfaces/addCard.interface';

import { validateCardNumber, validateHolderName, validateExpiryDate, validateSecurityCode, validateOTPCode } from './validations';
import { t } from '../../i18n';
import type {  OtpResponse } from '../../services/interfaces/otp.interface';
import ChallengeModal from '../../hooks/AddCardHook/Verify3dsHook';

import type { ErrorModel } from '../../interfaces';
import { addCard } from '../../services/cards/Add.card';
import { verify } from '../../services/transactions/verify.transaction';
import type { BrowserResponse } from '../../services/interfaces/generic.interface';
import { confirmCres, createCresReference, cresGetData, loginCres } from '../../services/cres/cres.service';
import Environment from '../../environment/environment';
// import NuveiSdk from '../../NuveiSdk';
// import Environment from '../../environment/environment';

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
  onSuccess?: (response: AddCardResponse) => void;
  onVerifyOtp?: (response: OtpResponse) => void;
  onError?: (response: ErrorModel) => void;
  onLoading?: (isLoading: boolean) => void;
  moreInfoOtp?: boolean
}

const PaymentGatewayForm = ({
  userInfo,
  showHolderName = true,
  theme = {},
  onSuccess,
  onError,
  onLoading,
  onVerifyOtp,
  moreInfoOtp = true
}: PaymentGatewayFormProps) => {

  //FORM INPUTS INFORMATION
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [dateExpiry, setDateExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [otpCode, setOtpCode] = useState("");

  //ANIMATIONS FLIP CARD
  const [isFlipped, setIsFlipped] = useState(false);

  //PROCESS INFOMATION
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [challengeHtml, setChallengeHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  //VALIDATIONS:
  const [verifyByOtp, setVerifyByOtp] = useState<boolean>(false);
  const [isOtpValid, setIsOtpValid] = useState<boolean>(true);
  const [validateBy3ds, setValidateBy3ds] = useState<boolean>(false);
  // const [validOtp, setValidOtp] = useState<boolean>(true);
  // const [validate3ds, setValidate3ds] = useState<boolean>(false);

  //information
  const [cardAdded, setCardAdded] =  useState<AddCardResponse>();

  // Variable global o de estado (para controlar si ya hay una petición activa)
let isFetchingCres = false;
let cresInterval: NodeJS.Timeout | null = null;
let token :string;
let referenceId: string;
let transactionId: string

async function startCresPolling(token: string, id: string) {
  if (cresInterval) return; // evita crear múltiples intervalos

  cresInterval = setInterval(async () => {
    if (isFetchingCres) return; // evita solapamiento de peticiones
    isFetchingCres = true;

    try {
      const response = await cresGetData(token, id);
      console.log('🌤️ cresGetData response:', response);

      if (response.data.cres) {
        console.log('✅ Proceso 3DS completado correctamente:', response);
        // detener el polling
        stopCresPolling();
        const saveDataResponse = await confirmCres(token, referenceId);
        if(saveDataResponse){

        
        challengeValidationCress(response.data.cres);
        }
      }
    } catch (err) {
      console.error('❌ Error en cresGetData:', err);
      stopCresPolling();
    } finally {
      isFetchingCres = false;
    }
  }, 5000);
}

function stopCresPolling() {
  if (cresInterval) {
    clearInterval(cresInterval);
    cresInterval = null;
    isFetchingCres = false;
  }
}



  //CUSTOM HOOKS
  const handleCardNumber = (value: string) => {
    const result = formatCardNumber(value);
    setCardNumber(result);
    setCardInfo(getCardInfo(result));
  };



  const handleExpiryChange = (value: string) =>
    setDateExpiry(formatExpiry(value));

  const isFormValid =
    !validateCardNumber(cardNumber) &&
    !validateHolderName(cardholderName, showHolderName) &&
    !validateExpiryDate(dateExpiry) &&
    !validateSecurityCode(securityCode, cardInfo?.cvcNumber) &&
    !(verifyByOtp && validateOTPCode(otpCode));

  const handleAddCardPress = async () => {
    if (!isFormValid) return;
    onLoading?.(true);
    setIsLoading(true)

    try {
      const [monthStr, yearStr] = dateExpiry.split('/');
      const month = parseInt(monthStr!, 10);
      const year = 2000 + parseInt(yearStr!, 10);

      const responseCress = await loginCres(Environment.getInstance().clientId,Environment.getInstance().clientSecret );
      if(responseCress){
        token = responseCress.access_token;
        
      const responseCresResponse = await createCresReference(token||'')
      if(responseCresResponse){
      
        referenceId = responseCresResponse.id;
      
      const browserInfo = await getBrowserInfo()
      const response = await addCard({
        user: userInfo,
        card: {
          number: cardNumber.replace(/\s/g, ''),
          holder_name: cardholderName,
          expiry_month: month,
          expiry_year: year,
          cvc: securityCode,
          type: cardInfo?.typeCode,
        },
        extra_params: {
          threeDS2_data: {
            term_url: `https://nuvei-cres-dev-bkh4atahdegxa8dk.eastus-01.azurewebsites.net/api/cres/save/${responseCresResponse.id}`,
            device_type: 'browser'
          },
          browser_info: browserInfo
        }
      });
      console.log(response)
      transactionId = response.card.transaction_reference;
      setCardAdded(response);
      switch (response?.card.status) {
              case 'valid':
                onLoading?.(false);
                setIsLoading(false)
                onSuccess?.(response)
                clearAllForms()
                
                break;
              case 'pending':
                setVerifyByOtp(true);
                onLoading?.(false);
                setIsLoading(false)
                break;
              case 'review':
                verifyBy3dsProcess(response['3ds'].browser_response)
                break;
              case 'rejected':
                clearAllForms()
                onLoading?.(false);
                setIsLoading(false)
                onSuccess?.(response)
                break;
              default:
                onError?.({error: {
                  type:'Error in request',
                  help:'',
                  description:'Error in request'
                }})
                onLoading?.(false);
                setIsLoading(false)
                break;
            }
     
            
          }
        }
    } catch (err: any) {
      onLoading?.(false);
      clearAllForms()
      setIsLoading(false)
      console.log(err)
      onError?.(err['error'])
    }finally{
      clearAllForms()
    }
  };

  const clearAllForms = () => {
    setCardNumber("")
    setCardholderName("")
    setDateExpiry("")
    setSecurityCode("")
    setOtpCode("")
    setIsOtpValid(true)
    setVerifyByOtp(false)
    setCardInfo(undefined)
  }


  

  const verifyBy3dsProcess = async (browserResponse: BrowserResponse)=>{
    
      if(browserResponse.challenge_request){
        setIsLoading(false);
        onLoading?.(false);
        
        setChallengeHtml(browserResponse.challenge_request)
        // setChallengeHtml(`<!DOCTYPE html SYSTEM 'about:legacy-compat'><html class='no-js' lang='en'xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/><meta charset='utf-8'/></head><body OnLoad='OnLoadEvent();'><form action='https://ccapi-stg.paymentez.com/v2/3ds/mockchallenge' method='POST' id='threeD' name='threeD'>message_id: <input type='area' id='message_id' name='message_id' value='AU-106430' />;creq: <input type='area' id='creq'name='creq' value='ewogICAiYWNzVHJhbnNJRCIgOiAiMjZjZGI3ZjAtOTE0My00M2I0LTlhM2YtYWUwZWE1MzUyMzhjIiwKICA' />; \"term_url: <input type='area' id='term_url' name='term_url' value='https://lantechco.ec/img/callback3DS.php' />;\n            <input type='submit' value='proceed to issuer'></form><script language='Javascript'>document.getElementById('threeD').submit(); </script></body></body></html>`)
        setValidateBy3ds(true);
        startCresPolling(token, referenceId);
      }else{
        try {
          setTimeout(() => { }, 5000)
          const response = await verify({
            user: {
              id: userInfo.id
            }, transaction: {
              id: cardAdded?.card.transaction_reference ?? ''
            },
            value: '',
            type: 'AUTHENTICATION_CONTINUE',
            more_info: moreInfoOtp
          })

          switch (response.transaction?.status) {
                    case 'success':
                      onVerifyOtp?.(response)
                      setIsLoading(false);
                      onLoading?.(false);
                      break;
                    case 'pending':
                      verifyBy3dsProcess(response['3ds']!.browser_response)
                      break;
                    case 'failure':
                      onVerifyOtp?.(response)
                      setIsLoading(false);
                      onLoading?.(false);
                      break;
                    default:
                    onError?.({error:{
                      type:'Error in request',
                      help:'',
                      description:'Error in request'
                    }})
                    onLoading?.(false);
                    setIsLoading(false)
                    break;
                  }
        } catch (err: any) {
          onLoading?.(false);
          setIsLoading(false)
          onError?.(err['error'])
        }
        


      }
  }



  const handleVerifyOtp = async () =>{
      try {
        setIsLoading(true)
        onLoading?.(true);
        const response = await verify({
                user: {
                  id: userInfo.id
                }, transaction: {
                  id: cardAdded?.card.transaction_reference ?? ''
                },
                value: otpCode,
                type: 'BY_OTP',
                more_info: moreInfoOtp
              });
              switch (response.transaction?.status_detail) {
                        case 31:
                          setOtpCode("")
                          setIsOtpValid(false)
                          break;
                        case 32:
                          setIsOtpValid(true)
                          onVerifyOtp?.(response)
                          break;
                        case 33:
                          clearAllForms()
                          onVerifyOtp?.(response)
                          break;
                        default:
                          setOtpCode("")
                          setIsOtpValid(false)
                          break;
                      }
      } catch (err:any) {
        onError?.(err)
      }finally{
        setIsLoading(false);
        onLoading?.(false);
      }
  }


  const  challengeValidationCress = async(crestValue: string )=>{
    try {
      setValidateBy3ds(false)
      setIsLoading(true)
      onLoading?.(true);
      const response = await verify({
        user: {
          id: userInfo.id
        }, transaction: {
          id: transactionId
        },
        value: crestValue,
        type: 'BY_CRES',
        more_info: moreInfoOtp
      });

      onVerifyOtp?.(response)
      
      setIsLoading(false)
      onLoading?.(false);
    } catch (err:any) {
      
      onLoading?.(false);
      setIsLoading(false)
      onError?.(err)
    }

  }

  const handlePressButton = ()=>{
    if(verifyByOtp){
       handleVerifyOtp()
    }else{
      handleAddCardPress()
    }
  }

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >

      <ChallengeModal
        visible={validateBy3ds}
        onClose={() => {
          
        }}
        onSuccess={() => { }}
        challengeHtml={challengeHtml}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Tarjeta ilustrativa */}
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

        {/* Inputs */}
        <ShadowInput
          label={t('forms.cardNumber')}
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChangeText={handleCardNumber}
          maxLength={19}
          editable={!verifyByOtp}
          keyboardType='numeric'
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
            forceUppercase={true}
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

        {/* Expiry y CVV */}
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
              isFlipped={true}
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


        {/* Botón */}
        <Pressable
          style={[
            styles.button,

            { backgroundColor: theme.buttonColor || '#000' },
            (!isFormValid  && styles.disabledButton) || (isLoading && styles.disabledButton) ,
          ]}
          onPress={handlePressButton}
          // onPress={()=>{handleAddCardPress()}}
          disabled={!isFormValid || isLoading}
        >
          <Text
            style={{
              color: theme.buttonTextColor || '#fff',
              textAlign: 'center',
            }}
          >
            {verifyByOtp ? 'Verify Code' : 'Add Card'}
          </Text>
        </Pressable>
        <Button title='Show Modal' onPress={() => {
          setChallengeHtml(`<!DOCTYPE html SYSTEM 'about:legacy-compat'><html class='no-js' lang='en'xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/><meta charset='utf-8'/></head><body OnLoad='OnLoadEvent();'><form action='https://ccapi-stg.paymentez.com/v2/3ds/mockchallenge' method='POST' id='threeD' name='threeD'>message_id: <input type='area' id='message_id' name='message_id' value='AU-106430' />;creq: <input type='area' id='creq'name='creq' value='ewogICAiYWNzVHJhbnNJRCIgOiAiMjZjZGI3ZjAtOTE0My00M2I0LTlhM2YtYWUwZWE1MzUyMzhjIiwKICA' />; \"term_url: <input type='area' id='term_url' name='term_url' value='https://lantechco.ec/img/callback3DS.php' />;\n            <input type='submit' value='proceed to issuer'></form><script language='Javascript'>document.getElementById('threeD').submit(); </script></body></body></html>`)
          setValidateBy3ds(true);
        }} />
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
    width: Dimensions.get('window').width * 0.9, // 90% del ancho de la pantalla
    height: Dimensions.get('window').height * 0.7, // 70% del alto de la pantalla
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  webView: {
    justifyContent: 'center',
    // flex:1,
    marginTop: 60,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PaymentGatewayForm;
