import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './routes/AppRouter';
import 'react-native-get-random-values';

export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}
