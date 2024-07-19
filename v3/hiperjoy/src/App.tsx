import Container from "@mui/material/Container";
import Gamepad from "./Gamepad";
import MediaPanel from "./MediaPanel";
import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 3000);

    return () => clearTimeout(timer);
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
