import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { homeStyle } from '../styles/homeStyles';
import ButtonCustom from '../../../shared/components/ButtonComponent/ButtonCustom';
import { useNavigation, useRoute } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../routes/navigations';
import ScreenWrapper from '../../../shared/components/layout/LayoutScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { paymentService, type CardListItem, type PaymentDebitResponse } from 'nuvei-sdk';
export interface Product {
  quantity: number;
  description: string;
  price: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomePage() {

  const [payment, setPayment] = useState<PaymentDebitResponse | null>()
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardListItem | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleCardSelected = (card: CardListItem) => {
    console.log('Card selected:', card); // Para depuración
    setSelectedCard(card);
  };

  const processPay = async (card: CardListItem) => {
    try {
      setIsLoadingPayment(true);
      setPayment(null)
      const response = await paymentService({
        user: { id: '4', email: 'test@example.com' },
        card: card,
        order: {
          amount: 99,
          description: 'pozole',
          dev_reference: 'referencia',
          vat: 0,
          taxable_amount: 0,
          tax_percentage: 0,
        },
      });
      setPayment(response);
      Alert.alert('Payment ok', payment?.transaction.message, [
        {
          text: 'OK',
          onPress: () =>
            navigation.push('DetailsPayment', { paymentResponse: response }),
        },
      ]);
      setSelectedCard(null);
    } catch (err: any) {
      console.log(err)      
    }finally{
      setIsLoadingPayment(false)
    }
  
    // console.log(isLoadingPayment);
    // console.log(errorPayment);

  };

  // useEffect(() => {
  //   if (isLoadingPayment) return;
  //   if (payment && !errorPayment) {
  //     console.log(payment);
  //     Alert.alert('Payment ok', 'Payment has been processed successfully.', [
  //       { text: 'OK', onPress: () =>  {navigation.push('DetailsPayment', {paymentResponse:payment} )}},
  //     ]);
  //     setSelectedCard(null);
  //   }

  //   if (errorPayment) {
  //     Alert.alert(
  //       'Payment Error',
  //       `Error: ${errorPayment.type}\n${errorPayment.description}`,
  //       [{ text: 'OK', onPress: () => console.log('Error OK Pressed') }]
  //     );
  //   }
  // }, [payment, errorPayment, isLoadingPayment]);

  const dataProducts: Product[] = [
    {
      quantity: 2,
      description: 'Milk Shake',
      price: 10.0,
    },
    {
      quantity: 3,
      description: 'Cupcake',
      price: 7.0,
    },
    {
      quantity: 1,
      description: 'bread',
      price: 5.0,
    },
  ];

  const renderItem = ({ item, index }: { item: Product; index: number }) => (
    <View key={index} style={homeStyle.listItem}>
      <Text>{item.price}</Text>
      <Text>{item.description}</Text>
      <Text>{`\$${item.price.toFixed(2).toString()}`}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScreenWrapper isLoading={isLoadingPayment} loadingText="Procesing payment...">
        {/* <View style={{padding:30, flex: 1}}> */}

        <FlatList
          data={dataProducts}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.quantity}-${index}`}
          ListHeaderComponent={
            <View style={homeStyle.listItem}>
              <Text style={{ fontWeight: 'bold' }}>N°</Text>
              <Text style={{ fontWeight: 'bold' }}>Description</Text>
              <Text style={{ fontWeight: 'bold' }}>Price</Text>
            </View>
          }
        />

        <Pressable
          onPress={() =>
            navigation.navigate('ListCard', {
              onCardSelected: handleCardSelected,
            })
          }
          style={homeStyle.cardConatiner}
        >
          {selectedCard ? (
            <>
            <View style={{flexDirection:'row', alignItems:'center', gap:20}}>
            <Image
        style={{ width: 40, height: 25, resizeMode: 'contain'}}
        source={{
          uri:
            selectedCard.image ??
            'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
        }}
      />
            <View>
              <Text>Name: {selectedCard.holder_name}</Text>
              <Text>Number: {selectedCard.number}</Text>
              <Text>Tye: {selectedCard.type}</Text>
            </View>
            </View>
            </>
          ) : (
            <>
              <Text>No card selected</Text>
              <Text>To continue, you need to select one</Text>
            </>
          )}
        </Pressable>

        <ButtonCustom
          name="Pay order"
          onPress={() => processPay(selectedCard!)}
        />
      </ScreenWrapper>
    </SafeAreaView>
  );
}
