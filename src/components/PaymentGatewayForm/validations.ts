import { getCardInfo } from './helpers';
import { t } from '../../i18n';

export function validateCardNumber(cardNumber: string): string {
  const clean = cardNumber.replace(/\D/g, '');
  if (!clean) return t('errorForms.numberCardError');
  const info = getCardInfo(clean);
  if (!info) return t('errorForms.numberCardError');
  if (!info.validLengths.includes(clean.length))
    return t('errorForms.numberCardError');

  // Luhn check
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) return t('errorForms.numberCardError');
  return '';
}

export function validateHolderName(
  name: string,
  showHolderName: boolean
): string {
  if (showHolderName && name.trim().length === 0)
    return t('errorForms.holderNameError');
  return '';
}

export function validateExpiryDate(expiry: string): string {
  if (!expiry || expiry.trim().length !== 5)
    return t('errorForms.expiryDateError');
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr!, 10);
  const year = parseInt(yearStr!, 10);
  if (isNaN(month) || isNaN(year) || month < 1 || month > 12)
    return t('errorForms.expiryDateError');

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth))
    return t('errorForms.expiryDateError');
  return '';
}

export function validateSecurityCode(
  cvv: string,
  cardInfoCvc?: number
): string {
  const required = cardInfoCvc || 3;
  if (cvv.trim().length !== required) return t('errorForms.cvcError');
  return '';
}


export function validateOTPCode(otpCode: string, isValid?: boolean): string {
  const required = 6;
  if (otpCode.trim().length !== required) return t('errorForms.otpError');
  if (isValid === false) return t('errors.otpNotValid');
  return '';
}

