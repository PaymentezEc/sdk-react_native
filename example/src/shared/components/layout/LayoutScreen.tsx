import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ScreenWrapperProps {
  isLoading?: boolean;
  loadingText?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  isLoading = false,
  loadingText = 'Cargando...',
  errorMessage,
  onRetry,
  children,
}) => {
  return (
    <View style={styles.container}>
      {children}

      {/* Overlay de carga */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.overlayText}>{loadingText}</Text>
        </View>
      )}

      {/* Overlay de error */}
      {!isLoading && errorMessage && (
        <View
          style={[styles.overlay, { backgroundColor: 'rgba(255,0,0,0.1)' }]}
        >
          <Text style={[styles.overlayText, { color: 'red' }]}>
            {errorMessage}
          </Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={{ color: '#fff' }}>Reintentar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ff4444',
    borderRadius: 6,
  },
});

export default ScreenWrapper;
