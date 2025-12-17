// import { useRef, useState } from 'react';
// import { View, TextInput, Text, StyleSheet } from 'react-native';

// export interface ShadowInputProps {
//   label: string;
//   placeholder: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   maxLength?: number;
//   keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
//   setIsFlipped?: (flipped: boolean) => void;
//   isFlipped?: boolean;
//   validation?: (value: string) => string;
//   allowedChars?: RegExp;
//   labelStyle?: object;
//   inputStyle?: object;
//   errorStyle?: object;
//   wrapperStyle?: object;
// }

// const ShadowInput = ({
//   label,
//   placeholder,
//   value,
//   onChangeText,
//   maxLength,
//   keyboardType = 'default',
//   setIsFlipped,
//   isFlipped,
//   validation,
//   allowedChars,
//   labelStyle,
//   inputStyle,
//   errorStyle,
//   wrapperStyle
// }: ShadowInputProps) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [localError, setLocalError] = useState('');
//   const inputRef = useRef<TextInput>(null);

//   const errorToShow = localError;
//   const handleFocus = () => {
//     setIsFocused(true);
//     if (setIsFlipped && typeof isFlipped === 'boolean') {
//       setIsFlipped(placeholder === 'CCV/CVV');
//     }
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//     if (setIsFlipped && typeof isFlipped === 'boolean') {
//       setIsFlipped(false);
//     }

//     if (validation) {
//       const validationResult = validation(value);
//       setLocalError(validationResult);
//     }
//   };

//   const handleChangeText = (text: string) => {
//     if (allowedChars) {
//       text = text
//         .split('')
//         .filter((char) => allowedChars.test(char))
//         .join('');
//     }
//     onChangeText(text);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Label */}
//       <Text style={styles.label}>{label}</Text>

//       {/* Input con sombra */}
//       <View
//         style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
//       >
//         <TextInput
//           ref={inputRef}
//           placeholder={placeholder}
//           style={styles.input}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onChangeText={handleChangeText}
//           value={value}
//           maxLength={maxLength}
//           autoCapitalize={placeholder === 'Ej: John Doe' ? 'words' : 'none'}
//           keyboardType={keyBoardType}
//         />
//       </View>

//       {/* Mensaje de error */}
//       {errortoShow ? <Text style={styles.errorText}>{errortoShow}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   label: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 6,
//   },
//   inputWrapper: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 4,
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     minHeight: 48,
//     justifyContent: 'center',
//   },
//   inputWrapperFocused: {
//     borderColor: '#f5d7d3',
//     borderWidth: 2,
//     elevation: 10,
//   },
//   input: {
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#000',
//     flexGrow: 1,
//   },
//   errorText: {
//     marginTop: 4,
//     color: 'red',
//     fontSize: 12,
//   },
// });

// export default ShadowInput;

import { useRef, useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export interface ShadowInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  editable?: boolean,
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  setIsFlipped?: (flipped: boolean) => void;
  isFlipped?: boolean;
  validation?: (value: string) => string;
  allowedChars?: RegExp;
  labelStyle?: object;
  inputStyle?: object;
  errorStyle?: object;
  wrapperStyle?: object;
  forceUppercase?: boolean; // NUEVO: forzar mayúsculas
}

const ShadowInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  maxLength,
  keyboardType = 'default',
  setIsFlipped,
  isFlipped,
  editable = true, 
  validation,
  allowedChars,
  labelStyle,
  inputStyle,
  errorStyle,
  wrapperStyle,
  forceUppercase = false,
}: ShadowInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const errorToShow = localError;

  const handleFocus = () => {
    setIsFocused(true);
    if (setIsFlipped && typeof isFlipped === 'boolean') {
      setIsFlipped(placeholder === 'CCV/CVV');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (setIsFlipped && typeof isFlipped === 'boolean') {
      setIsFlipped(false);
    }

    if (validation) {
      const validationResult = validation(value);
      setLocalError(validationResult);
    }
  };

  const handleChangeText = (text: string) => {
    if (allowedChars) {
      text = text
        .split('')
        .filter((char) => allowedChars.test(char))
        .join('');
    }
    if (forceUppercase) {
      text = text.toUpperCase();
    }
    onChangeText(text);
  };

  return (
    <View style={[styles.container, wrapperStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
      >
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          style={[styles.input, inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          onChangeText={handleChangeText}
          value={value}
          maxLength={maxLength}
          autoCapitalize={'none'} // lo manejamos manualmente
          keyboardType={keyboardType}
        />
      </View>
      {errorToShow ? (
        <Text style={[styles.errorText, errorStyle]}>{errorToShow}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 14, color: '#000', marginBottom: 6 },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#000',
    borderWidth: 2,
    elevation: 6,
  },
  input: { fontSize: 16, color: '#000' },
  errorText: { marginTop: 4, color: 'red', fontSize: 12 },
});

export default ShadowInput;
