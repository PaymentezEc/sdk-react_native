import { Pressable, Text } from 'react-native';
import { ButtonStyle } from './ButtonStyle';

interface ButtonCustom {
  name: string;
  onPress: () => void;
}

const ButtonCustom = ({ name, onPress }: ButtonCustom) => {
  return (
    <>
      <Pressable
        onPress={() => onPress && onPress()}
        style={({ pressed }) => [
          ButtonStyle.buttonStyle,
          pressed && ButtonStyle.buttonPressed,
        ]}
      >
        <Text style={ButtonStyle.textSytle}>{name}</Text>
      </Pressable>
    </>
  );
};

export default ButtonCustom;
