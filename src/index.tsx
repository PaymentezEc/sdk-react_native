export { default as NuveiSdk } from './NuveiSdk';
export * from './services';
export * from './interfaces';
export * from './i18n';
export * from './components';

// export function multiply(a: number, b: number): number {
//   return NuveiSdk.multiply(a, b);
// }
export { HelloFromSDK };

import { Text, View, StyleSheet } from 'react-native';

const HelloFromSDK = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola desde Nuvei SDK!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  text: { fontSize: 18, color: 'blue' },
});
