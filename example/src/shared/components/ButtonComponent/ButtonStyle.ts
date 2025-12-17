import { Platform, StyleSheet } from 'react-native';

export const ButtonStyle = StyleSheet.create({
  textSytle: {
    fontSize: 17,
    color: '#ffffff',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
  },
  buttonStyle: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Platform.OS === 'android' ? '#1d1d1d' : 'black',
  },
  buttonPressed: {
    backgroundColor: Platform.OS === 'android' ? '#1d1d1d' : 'grey',
  },
});
