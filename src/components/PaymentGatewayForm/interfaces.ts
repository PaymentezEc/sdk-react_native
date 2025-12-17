import type { KeyboardTypeOptions } from 'react-native';

export interface ShadowInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  value: string;
  maxLength: number;
  setIsFlipped?: (isFlipped: boolean) => void;
  isFlipped?: boolean;
  keyBoardType: KeyboardTypeOptions;
}
export type CardType =
  | 'Visa'
  | 'Mastercard'
  | 'American Express'
  | 'Diners'
  | 'Discover'
  | 'Maestro'
  | 'Exito'
  | 'Alkosto'
  | 'Codensa'
  | 'Olimpica'
  | 'EPM'
  | 'Colsubsidio'
  | 'BBVA'
  | 'Falabella'
  | 'Carnet'
  | 'Credisensa'
  | 'Solidario'
  | 'Union Pay'
  | 'Elo'
  | 'JCB'
  | 'Aura'
  | 'Sodexo'
  | 'Hipercard'
  | 'Unknown';

export interface CardInfo {
  type: CardType;
  regex: RegExp;
  mask: string;
  validLengths: number[];
  typeCode: string;
  icon: string;
  cvcNumber: number;
  gradientColor?: string[];
}


export const cardTypes: CardInfo[] = [
  {
    type: 'Visa',
    regex: /^4/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [13, 16, 19],
    typeCode: 'vi',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_visa.imageset/stp_card_visa@3x.png?raw=true',
    gradientColor: ['#1a1f71', '#3d5bf6'],
  },
  {
    type: 'Mastercard',
    regex: /^(5[1-5]|2[2-7])/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'mc',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_mastercard.imageset/stp_card_mastercard@3x.png?raw=true',
    gradientColor: ['#eb001b', '#f79e1b'],
  },
  {
    type: 'American Express',
    regex: /^3[47]/,
    mask: '#### ###### #####',
    cvcNumber: 4,
    validLengths: [15],
    typeCode: 'ax',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_amex.imageset/stp_card_amex@3x.png?raw=true',
    gradientColor: ['#2e77bb', '#1e5799'],
  },
  {
    type: 'Diners',
    regex: /^3(0[0-5]|[68])/,
    mask: '#### ###### ####',
    cvcNumber: 3,
    validLengths: [14],
    typeCode: 'di',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_diners.imageset/stp_card_diners@3x.png?raw=true',
    gradientColor: ['#006ba1', '#00b5e2'],
  },
  {
    type: 'Discover',
    regex: /^(6011|65|64[4-9]|622)/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16, 19],
    typeCode: 'dc',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_discover.imageset/stp_card_discover@3x.png?raw=true',
    gradientColor: ['#ff6f00', '#ff8f00'],
  },
  {
    type: 'Maestro',
    regex: /^(5[06789]|6)/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [12, 13, 14, 15, 16, 17, 18, 19],
    typeCode: 'ms',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#00a2e5', '#ed1c24'],
  },
  {
    type: 'Union Pay',
    regex: /^62/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16, 17, 18, 19],
    typeCode: 'up',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_unionpay.png',
    gradientColor: ['#d81e06', '#0071bc'],
  },
  {
    type: 'JCB',
    regex: /^35(2[89]|[3-8])/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'jc',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#007bc1', '#1c94d2'],
  },
  {
    type: 'Elo',
    regex: /^(4011|4389|6363|5067|4576)/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'el',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_exito.png',
    gradientColor: ['#00a4e4', '#ffd200'],
  },
  {
    type: 'Hipercard',
    regex: /^606282/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'hpc',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#9b1c1f', '#c1272d'],
  },
  {
    type: 'Aura',
    regex: /^50/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'au',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#00a4e4', '#ffd200'],
  },
  {
    type: 'Sodexo',
    regex: /^606071/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'sx',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#004b8d', '#0071bc'],
  },
  {
    type: 'Carnet',
    regex: /^60420/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'cn',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_exito.png',
    gradientColor: ['#ed1c24', '#f47920'],
  },
  {
    type: 'Exito',
    regex: /^604203/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'ex',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_exito.png',
    gradientColor: ['#ffdd00', '#fbb034'],
  },
  {
    type: 'Alkosto',
    regex: /^523523/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'ak',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_alkosto.png',
    gradientColor: ['#f37021', '#ff8f00'],
  },
  {
    type: 'Codensa',
    regex: /^590712/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'cd',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_codensa.png',
    gradientColor: ['#ffcc00', '#fbb034'],
  },
  {
    type: 'Olimpica',
    regex: /^589657/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'ol',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_tcolimpica.png',
    gradientColor: ['#004b8d', '#e30613'],
  },
  {
    type: 'EPM',
    regex: /^5041/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'epm',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#6abd45', '#009640'],
  },
  {
    type: 'Colsubsidio',
    regex: /^5062/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'csd',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_csd.png',
    gradientColor: ['#004b8d', '#ffcc00'],
  },
  {
    type: 'BBVA',
    regex: /^(4001|5280)/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'bbva',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#004481', '#007bc8'],
  },
  {
    type: 'Falabella',
    regex: /^5078/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'cmr',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#7bb241', '#4e9e27'],
  },
  {
    type: 'Credisensa',
    regex: /^5074/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'cs',
    icon: 'https://s3.amazonaws.com/cdn.images/cc/image/ic_exito.png',
    gradientColor: ['#00a859', '#007d3c'],
  },
  {
    type: 'Solidario',
    regex: /^60420[1-5]/,
    mask: '#### #### #### ####',
    cvcNumber: 3,
    validLengths: [16],
    typeCode: 'so',
    icon: 'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
    gradientColor: ['#f47920', '#e94e1b'],
  },
];
