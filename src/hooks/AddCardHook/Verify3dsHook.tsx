
import { Modal, View, Button } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";
// import InterceptorHttp from "../../http/interceptor";

type ChallengeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: (response: any) => void;
  challengeHtml: string
};

export default function ChallengeModal({
  visible,
  onClose,
  challengeHtml
  // onSuccess,
}: ChallengeModalProps) {

  const handleNavigation = async (event: WebViewNavigation) => {

    
    if (event.url.includes("callback3DS.php")) {
      try {
       
        
        onClose();
        return false; // detener navegación
      } catch (err) {
        console.error(" Error try parsing url :", err);
      }
    }

    return true;
  };

  

  return (
    <Modal visible={visible} animationType="slide" >
        <View style={{flex:1, paddingVertical:'15%', paddingHorizontal:'5%'}}>

        <WebView
        
        // originWhitelist={["*"]}
        source={{ html: challengeHtml }}
        onNavigationStateChange={handleNavigation}
        
        // onLoadEnd={() => setLoading(false)}
        />
        <Button title="Cerrar" onPress={onClose} />
    
        </View>
          
    </Modal>
  );
}
