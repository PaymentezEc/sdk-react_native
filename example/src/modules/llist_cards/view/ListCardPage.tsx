import { useNavigation, useRoute } from '@react-navigation/native';

import { listCards, type CardListItem, type ListCardResponse, type DeleteCardResponse, deleteCard, type ErrorModel } from 'nuvei-sdk';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonCustom from '../../../shared/components/ButtonComponent/ButtonCustom';

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../routes/navigations';
import { useEffect, useState, } from 'react';
import ScreenWrapper from '../../../shared/components/layout/LayoutScreen';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = NativeStackScreenProps<
  RootStackParamList,
  'ListCard'
>['route'];

const ListCardPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listCard, setListCard] = useState<ListCardResponse>();
  // const [deleteCardMessage, setDeleteCardMessage] =  useState<DeleteCardResponse>();
  const [error, setError] = useState<ErrorModel | null>(null);
  // const { cardsList, isLoadingList, errorList, getCardsList } = ListCardHook();

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();

  useEffect(()=>{
    fetchCardsExample();
  },[])

  async function fetchCardsExample() {
    try {
      setIsLoading(true)
      setError(null)
      const res = await listCards('4');
      setListCard(res)// solo tarjetas válidas
    } catch (err:any) {
      console.error('error', err);
      setError(err)
    }finally{
      setIsLoading(false)
    }
  }

  const deleteCardFunction = async (userId: string, tokenCard: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await deleteCard({card:{token: tokenCard}, user:{id:userId}});
      // setDeleteCardMessage(response)
      if (response?.message) {
      Alert.alert('Alert', response.message.toUpperCase(), [
        { text: 'OK', onPress: () => {fetchCardsExample()} },
      ]);
    }
    } catch (err: any) {
      console.error('error', err);
      setError(err)
    }finally{
      setIsLoading(false)
    }
    // console.log(messageDelete?.message)
    
  };

  const selectCard = (card: CardListItem) => {
    if (route.params?.onCardSelected) {
      route.params.onCardSelected(card);
    }
    navigation.goBack();
  }




  const renderCard = ({ item }: { item: CardListItem }) => (
    <View
      style={{
        ...styles.cardContainer,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Image
        style={{ width: 40, height: 25, resizeMode: 'contain' }}
        source={{
          uri:
            item.image ??
            'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true',
        }}
      />
      <Pressable onPress={() => selectCard(item)}>
        <Text style={styles.cardText}>Name: {item.holder_name}</Text>
        <Text style={styles.cardText}>
          Card´s number: **** **** **** {item.number.slice(-4)}
        </Text>
        <Text style={styles.cardText}>
          Type: {item.type}
        </Text>
        <Text style={styles.cardText}>
          Expiry date: {item.expiry_month}/{item.expiry_year}
        </Text>
      </Pressable>
      <Pressable onPress={() => deleteCardFunction('4', item.token)}>
        <Text style={styles.deleteText}>X</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenWrapper
        isLoading={isLoading }
        loadingText={'Loading....'}
        errorMessage={error?.error.description }
        onRetry={() => fetchCardsExample()}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Card´s List</Text>
          <ButtonCustom
            name="Reload Card list"
            onPress={() => fetchCardsExample()}
          />
          <FlatList
            data={listCard?.cards}
            renderItem={renderCard}
            keyExtractor={(item, index) => `${item.token}-${index}`}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.noCardsText}>Card´s not avaliable</Text>
            }
          />
          <ButtonCustom
            name="Add Card"
            onPress={() => navigation.navigate('AddCardPage')}
          />
        </View>
      </ScreenWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { fontSize: 16, marginBottom: 4 },
  deleteText: { fontSize: 18, color: 'red', fontWeight: 'bold' },
  noCardsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  listContainer: { paddingBottom: 16 },
});

export default ListCardPage;
