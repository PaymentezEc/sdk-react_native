export default {
  forms: {
    holderName: 'Nombre de titular',
    cardNumber: 'Número de tarjeta',
    expiryDate: 'Fecha Expiración',
    securityCode: 'CVV/CVVC',
    otpCode: 'Código otp'
  },
  errorForms: {
    holderNameError: 'El nombre no es válido',
    numberCardError: 'El número no es válido',
    expiryDateError: 'La fecha no es válida',
    otpError: 'El código otp no es válido',
    cvcError: 'El código de seguridad no es válido',
  },
  errors: {
    notInitialized: 'Ambiente no inicializado',
    empityData: 'Información vacia',
    errorNetwork: 'Error de conexión, intente nuevamente',
    errorException: 'Ocurrió un error, intente nuevamente',
    serverError: 'Error de servidor, contacte al equipo de Nuvei',
    otpNotValid: 'El código OTP no es válido'
  },
};
