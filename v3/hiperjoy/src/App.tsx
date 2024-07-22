import Container from "@mui/material/Container";
import { useState, useEffect } from "react";

import Gamepad from "./Gamepad";
import MediaPanel from "./MediaPanel";
import SplashScreen from "./SplashScreen";
import { fetchHello } from "./fetchers";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      console.log(fetchHello());
      setIsConnected(true);
    } catch (error) {
      console.log(error);
    }
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
