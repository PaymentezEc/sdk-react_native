import { Image } from 'react-native';

const AppBarComponent = () => {
  return (
    <Image
      source={require('../../../assets/logo-nuvei.png')}
      style={{
        width: 130,
      }}
      resizeMode="contain"
    />
  );
};

export default AppBarComponent;
