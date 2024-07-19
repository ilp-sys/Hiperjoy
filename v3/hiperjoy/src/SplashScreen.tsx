import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import logo from "./assets/hiperwall.png";

const SplashContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

const SplashScreen: React.FC = () => {
  return (
    <SplashContainer>
      <img src={logo} />
      <Typography variant="h4">시스템에 연결 중..</Typography>
      <CircularProgress style={{ marginTop: "20px" }} />
    </SplashContainer>
  );
};

export default SplashScreen;
