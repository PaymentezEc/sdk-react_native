import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { FlipCard } from './interfaces';
import { t } from '../../i18n';

interface AnimatedCardFlipProps extends FlipCard {
  width?: number;
  height?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const AnimatedCardFlip = ({
  isFlipped,
  cardHolderName,
  cardNumber,
  expiryDate = 'MM/YY',
  ccv,
  icon,
  gradient = ['#000', '#333'],
  width = screenWidth * 0.9,
  height = screenHeight / 4,
}: AnimatedCardFlipProps) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View
        style={[
          styles.card,
          styles.front,
          { width, height, transform: [{ rotateY: frontInterpolate }] },
        ]}
      >
        <LinearGradient
          colors={gradient}
          style={[styles.gradient, { width, height }]}
        >
          <View style={styles.iconWrapper}>
            <Image
              source={{ uri: icon }}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
          <View style={styles.cardInfoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>{t('forms.holderName')}</Text>
              <Text style={styles.value}>{cardHolderName}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>{t('forms.expiryDate')}</Text>
              <Text style={styles.value}>{expiryDate}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.back,
          { width, height, transform: [{ rotateY: backInterpolate }] },
        ]}
      >
        <LinearGradient
          colors={gradient}
          style={[styles.gradient, { width, height }]}
        >
          <View style={styles.cvcRow}>
            <View style={styles.ccvWrapper}>
              <Text style={styles.ccvText}>{ccv}</Text>
            </View>
            <Text style={styles.label}>CVC/CVV</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    borderRadius: 12,
    backfaceVisibility: 'hidden',
  },
  front: { zIndex: 2 },
  back: { zIndex: 1 },
  gradient: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  iconWrapper: { height: 40, width: 40, marginBottom: 16 },
  icon: { width: '100%', height: '100%' },
  cardNumber: {
    color: 'white',
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: 16,
  },
  cardInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBlock: { flex: 1 },
  label: { color: '#ddd', fontSize: 14, opacity: 0.8 },
  value: { color: 'white', fontSize: 16 },
  cvcRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ccvWrapper: { justifyContent: 'center', alignItems: 'flex-start' },
  ccvText: {
    color: 'white',
    backgroundColor: '#555',
    padding: 8,
    borderRadius: 6,
    fontSize: 16,
  },
});

export default AnimatedCardFlip;
