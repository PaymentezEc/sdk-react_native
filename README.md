# Nuvei React Native SDK

SDK para la integración de **pagos Nuvei** en aplicaciones **React Native**.  
Permite listar y eliminar tarjetas, realizar pagos débito, reembolsos y agregar tarjetas mediante un componente UI reutilizable.

---

## 📦 Instalación

Instala la librería directamente desde GitHub:
```bash
yarn add github: 
```
Si el SDK no está inicializado, todos los métodos lanzarán un error sdk_not_initialized.

## Funcionalidad
### 📋 Listar tarjetas

Obtiene las tarjetas válidas asociadas a un usuario.
```code
import { listCards } from 'nuvei-react-native-sdk';

const response = await listCards(userId);
```

#### Parámetros

Nombre    Tipo    Requerido
userId    string    ✅

Respuesta
```code
{
  cards: CardListItem[];
}
```

Solo se retornan tarjetas con estado valid y cada tarjeta incluye su ícono (image).

### ❌ Eliminar tarjeta

```code
import { deleteCard } from 'nuvei-react-native-sdk';

const response = await deleteCard({
  card: { token: tokenCard },
  user: { id: userId }
});

```
Ejemplo


```code
if (response?.message) {
  Alert.alert(
    'Alert',
    response.message.toUpperCase(),
    [{ text: 'OK', onPress: fetchCards }]
  );
}
```

### 💰 Pago débito

```code
import { paymentService } from 'nuvei-react-native-sdk';

const response = await paymentService({
  user: {
    id: '4',
    email: 'test@example.com'
  },
  card,
  order: {
    amount: 99,
    description: 'pozole',
    dev_reference: 'referencia',
    vat: 0,
    taxable_amount: 0,
    tax_percentage: 0
  }
});
```

Ejemplo completo
```code
const processPay = async (card) => {
  try {
    setIsLoadingPayment(true);

    const response = await paymentService({
      user: { id: '4', email: 'test@example.com' },
      card,
      order: {
        amount: 99,
        description: 'pozole',
        dev_reference: 'referencia',
        vat: 0,
        taxable_amount: 0,
        tax_percentage: 0,
      },
    });

    Alert.alert('Payment ok', response.transaction.message);
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoadingPayment(false);
  }
};
```
### 🔁 Reembolso

```code
import { refundPayment } from 'nuvei-react-native-sdk';

const response = await refundPayment(refundRequest);
```
### 🧩 Componente UI: PaymentGatewayForm

Componente que debe implementar el desarrollador integrador para agregar tarjetas.
```code
import { PaymentGatewayForm } from 'nuvei-react-native-sdk';
```

```code
<PaymentGatewayForm
  showHolderName={true}
  userInfo={{ email: 'erick.guillen@nuvei.com', id: '4' }}

  onSuccess={(success, message) => {
    if (success) {
      Alert.alert('Error', `Card ${message}`);
    } else {
      Alert.alert('Success', 'Card added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }}

  onLoading={(value) => {
    setLoadingAddCard(value);
  }}

  onError={(error) => {
    Alert.alert('Error', error.error.help);
  }}

  onVerifyOtp={(verify) => {
    if (verify.transaction?.status === 'failure') {
      Alert.alert(
        'Alert',
        verify.transaction.current_status ?? ''
      );
    } else {
      Alert.alert('Success', 'Card added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }}
/>

```

#### Props

Prop    Tipo    Descripción
showHolderName    boolean    Muestra nombre del titular
userInfo    object    Información del usuario
onSuccess    function    Resultado del registro
onLoading    function    Estado de carga
onError    function    Manejo de errores
onVerifyOtp    function    Resultado OTP
## Manejo de errores

Todos los métodos pueden lanzar errores con esta estructura:
```code 
{
  error: {
    type: string;
    help: string;
    description: string;
  };
}
```
