import { useEffect, useState } from "react";
import WebView from "react-native-webview";
import type { BrowserInfo } from "../../services/interfaces/addCard.interface";

// Agrega esto al inicio del componente
const browserInfoHtml = `
<!DOCTYPE html>
<html>
<body>
<script>
function collectBrowserInfo() {
  const browserInfo = {
    java_enabled: typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : false,
    language: navigator.language || navigator.userLanguage,
    color_depth: screen.colorDepth,
    screen_height: screen.height,
    screen_width: screen.width,
    timezone_offset: new Date().getTimezoneOffset(),
    user_agent: navigator.userAgent,
    js_enabled: true,
    accept_header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(browserInfo));
}
collectBrowserInfo();
</script>
</body>
</html>
`;

const useBrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>();
  const [ip, setIp] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIp(data.ip))
      .catch(error => console.error('Error al obtener IP:', error));
  }, []);

  const handleWebViewMessage = (event:any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setBrowserInfo({
        ...data,
        ip,
      });
    } catch (error) {
      console.error('Error en mensaje WebView:', error);
    }
  };

  const BrowserInfoCollector = () => (
    <WebView
      source={{ html: browserInfoHtml }}
      style={{ height: 0, width: 0, opacity: 0 }}
      javaScriptEnabled={true}
      onMessage={handleWebViewMessage}
      userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    />
  );

  return { browserInfo, BrowserInfoCollector };
};


export default useBrowserInfo;