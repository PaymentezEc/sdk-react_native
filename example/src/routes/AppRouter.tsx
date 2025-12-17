import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../modules/home/views/homePage';
import { PresentationPage } from '../modules/presentation/view/PresentationPage';
import AppBarComponent from '../shared/components/AppBar/AppBarComponent';

import ListCardPage from '../modules/llist_cards/view/ListCardPage';
import AddCardPage from '../modules/add_cards/view/AddCardPage';
import type { RootStackParamList } from './navigations';
import DetailsPaymentPage from '../modules/details_payment/views/DetailsPaymentPage';

const Stack = createStackNavigator<RootStackParamList>();

export const AppRoutes = () => {
  return (
    <Stack.Navigator initialRouteName="Presentation">
      <Stack.Screen
        name="Presentation"
        component={PresentationPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShadowVisible: false,
          headerMode: 'screen',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTitle(props) {
            props.style = false;
            return <AppBarComponent />;
          },
        }}
      />
      <Stack.Screen
        name="ListCard"
        component={ListCardPage}
        options={{
          headerShadowVisible: false,
          headerMode: 'screen',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTitle(props) {
            props.style = false;
            return <AppBarComponent />;
          },
        }}
      />
      <Stack.Screen
        name="AddCardPage"
        component={AddCardPage}
        options={{
          headerShadowVisible: false,
          headerMode: 'screen',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTitle(props) {
            props.style = false;
            return <AppBarComponent />;
          },
        }}
      />
      <Stack.Screen
        name="DetailsPayment"
        component={DetailsPaymentPage}
        options={{
          headerShadowVisible: false,
          headerMode: 'screen',
          headerStyle: { backgroundColor: 'transparent' },
          headerTitle: () => <AppBarComponent />,
        }}
      />

    </Stack.Navigator>
  );
};
