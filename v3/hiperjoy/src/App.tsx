import { useState, useEffect } from "react";

import Gamepad from "./components/Gamepad";
import MediaPanel from "./components/MediaPanel";
import MetaWalls from "./components/MetaWalls";
import HoverBox from "./components/HoverBox";
import SplashScreen from "./SplashScreen";
import { fetchHello } from "./utils/fetchers";
import LabelBottomNavigation from "./components/LabelBottomNavagation";
import Snackbar from "@mui/material/Snackbar";
import Container from "@mui/material/Container";

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connString, setConnString] = useState("");

  useEffect(() => {
    fetchHello()
      .then((response) => {
        setConnString(response);
        setSnackbarOpen(true);
        setIsConnected(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {isConnected ? (
        <>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={`connected on ${connString}`}
          />
          <HoverBox />
          <MediaPanel />
          <Gamepad />
          <MetaWalls />
          <LabelBottomNavigation />
        </>
      ) : (
        <SplashScreen />
      )}
    </>
  );
}

export default App;
