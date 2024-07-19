import Container from "@mui/material/Container";
import Gamepad from "./Gamepad";
import MediaPanel from "./MediaPanel";
import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      const url = "http://127.0.0.1:8000/xmlcommand";
      const xmlPayload = `
        <Request>
          <Type>CheckConnection</Type>
        </Request>
      `;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/xml",
          },
          body: xmlPayload,
        });

        if (response.ok) {
          const responseText = await response.text();
          console.log(responseText);
          setIsConnected(true);
        } else {
          console.error(
            "Failed to check connection status:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
      }
    };

    checkConnectionStatus();
  }, []);

  return (
    <>
      {isConnected ? (
        <Container>
          <MediaPanel />
          <Gamepad />
        </Container>
      ) : (
        <SplashScreen />
      )}
    </>
  );
}

export default App;
