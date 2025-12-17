import { Image, Text, View } from 'react-native';
import ButtonCustom from '../../../shared/components/ButtonComponent/ButtonCustom';
import NuveiSdk from '../../../../../src/NuveiSdk';
import { NUVEI_ENV } from '../../../shared/utils/constants';
import { useEffect } from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { setLanguage } from '../../../../../src/i18n';

export const PresentationPage = () => {
  // const {cards, isLoading, error, getCards} = ListCardHook('4');

  useEffect(() => {
    setLanguage('en');
    NuveiSdk.initEnvironmet(
      NUVEI_ENV.APP_CODE,
      NUVEI_ENV.APP_KEY,
      NUVEI_ENV.SERVER_CODE,
      NUVEI_ENV.SERVER_KEY,
      true,
      NUVEI_ENV.TERM_URL,
      NUVEI_ENV.CLIENT_ID,
      NUVEI_ENV.CLIENT_SECRET
    );
  });
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <Image
          source={require('../../../assets/logo-nuvei.png')}
          style={{
            width: 200,
          }}
          resizeMode="contain"
        />
        <Text>Sdk</Text>
      </View>
      <ButtonCustom
        name="Init Simulation"
        onPress={() => {
          navigation.dispatch(StackActions.replace('Home'));
        }}
      />
    </View>
  );

  // const handleGetCards= ()=>{
  //   getCards()
  // }

  // if(isLoading){
  //   return(
  //     <View style= {{flex:1, justifyContent: 'center', alignItems:'center'}}>
  //       <ActivityIndicator size='large'/>
  //       <Text>Loading cards...</Text>
  //     </View>
  //   )
  // }

  // if (error) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Error: {error.type}</Text>
  //       <Text>{error.help}</Text>
  //       <Text>{error.description}</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //   <View
  //     style={{
  //       flex: 1,
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //     }}
  //   >
  //     <Text>Presentation Page</Text>
  //     <ButtonCustom name="Fetch Cards" onPress={handleGetCards} />
  //     {cards.length === 0 ? (
  //       <Text>No hay tarjetas disponibles</Text>
  //     ) : (
  //       cards.map((card, index) => (
  //         <View key={index} style={{ marginVertical: 8 }}>
  //           <Text>Número: {card.number}</Text>
  //           <Text>Token: {card.type}</Text>
  //           <Text>Token: {card.token}</Text>

  //         </View>
  //       ))
  //     )}
  //   </View>
  // </SafeAreaView>

  // )
};
