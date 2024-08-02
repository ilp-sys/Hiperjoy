import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

import { fetchHello } from "./utils/fetchers";
import SplashScreen from "./screens/SplashScreen";
import CameraScreen from "./screens/CameraScreen";
import FeedsScreen from "./screens/FeedsScreen";
import FoldersScreen from "./screens/FoldersScreen";
import WallInfoScreen from "./screens/WallInfoScreen";

import {
  Container,
  Snackbar,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { TouchFree } from "./TouchFree_Tooling";

const hoverStyles = {
  "&:hover": {
    color: "primary.main",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
};

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connString, setConnString] = useState("");
  const [value, setValue] = useState(0);

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

  //TouchFree.Init();

  const navigate = useNavigate();
  const handleNavigationChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate("/feeds");
    } else if (newValue === 1) {
      navigate("/wallinfo");
    } else if (newValue === 2) {
      navigate("/camera");
    } else if (newValue === 3) {
      navigate("/folder");
    }
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ align: "center" }}>
      {isConnected ? (
        <>
          <Paper
            sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation
              value={value}
              onChange={handleNavigationChange}
              showLabels
            >
              <BottomNavigationAction
                label="Feeds"
                value={0}
                icon={<MonitorRoundedIcon />}
                sx={hoverStyles}
              />
              <BottomNavigationAction
                label="Wallinfo"
                value={1}
                icon={<InfoRoundedIcon />}
                sx={hoverStyles}
              />
              <BottomNavigationAction
                label="Camera"
                value={2}
                icon={<VideocamRoundedIcon />}
                sx={hoverStyles}
              />
              <BottomNavigationAction
                label="Folder"
                value={3}
                icon={<FolderIcon />}
                sx={hoverStyles}
              />
            </BottomNavigation>
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={`connected on ${connString}`}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/feeds" />} />
            <Route path="/feeds" element={<FeedsScreen />} />
            <Route path="/wallinfo" element={<WallInfoScreen />} />
            <Route path="/camera" element={<CameraScreen />} />
            <Route path="/folder" element={<FoldersScreen />} />
            <Route path="*" element={<Navigate to="/feeds" />} />
          </Routes>
        </>
      ) : (
        <SplashScreen />
      )}
    </Container>
  );
}

export default App;
