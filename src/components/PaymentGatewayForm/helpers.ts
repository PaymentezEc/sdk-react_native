import { Dimensions } from 'react-native';
import { type CardInfo, cardTypes } from './interfaces';
import DeviceInfo from 'react-native-device-info';
import{getLocales} from "react-native-localize";

export const formatExpiry = (value: string) => {
  // Solo mantener dígitos
  const digits = value.replace(/\D/g, '');
  // Cortar a máximo 4 dígitos (MMYY)
  let limited = digits.slice(0, 4);

  // Validar mes
  if (limited.length >= 1) {
    let month = limited.slice(0, 2);

    // Si se ingresa un solo dígito mayor a '1', lo corregimos automáticamente
    if (month.length === 1 && parseInt(month) > 1) {
      month = '0' + month;
      limited = month + limited.slice(1);
    }

    // Si ya hay 2 dígitos, validamos que estén entre 01 y 12
    if (month.length === 2) {
      const monthNum = parseInt(month);
      if (monthNum < 1 || monthNum > 12) {
        // Si es inválido, no lo mostramos (solo el primer dígito si acaso)
        return limited.slice(1, 2);
      }
    }
  }

  // Insertar '/' después de los primeros 2 dígitos
  if (limited.length >= 3) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return limited;
  }
};

export const getCardInfo = (number: string): CardInfo => {
  const clean = number.replace(/\D/g, '');
  for (const info of cardTypes) {
    if (info.regex.test(clean)) return info;
  }
  return {
    type: 'Unknown',
    regex: /^$/,
    mask: '#### #### #### ####',
    validLengths: [16],
    icon: '',
    typeCode: '',
    cvcNumber: 3,
  };
};


export const getIconCard = (typeCard: string): CardInfo =>{
  for (const info of cardTypes){
    if(info.typeCode === typeCard ) return info;
  }
  return {
    type: 'Unknown',
    regex: /^$/,
    mask: '#### #### #### ####',
    validLengths: [16],
    icon: '',
    typeCode: '',
    cvcNumber: 3,
  };
}


export function formatCardNumber(number: string): string {
  const clean = number.replace(/\D/g, '');
  const { mask } = getCardInfo(clean);
  let i = 0;
  let result = '';
  for (const c of mask) {
    if (c === '#') {
      if (!clean[i]) break;
      result += clean[i++];
    } else {
      if (i < clean.length) result += c;
    }
  }
  return result;
}



export async function getBrowserInfo() {
  const { width, height } = Dimensions.get("window");

  return {
    ip: await (await fetch("https://api.ipify.org?format=json")).json().then(d => d.ip),
    language: getLocales()[0]?.languageTag,
    java_enabled: false,
    js_enabled: true,
    color_depth: 24,
    screen_height: height,
    screen_width: width,
    timezone_offset: new Date().getTimezoneOffset() / -60,
    user_agent: await DeviceInfo.getUserAgent(),
    accept_header: "text/html"
  };
}
