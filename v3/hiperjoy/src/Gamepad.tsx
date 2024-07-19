import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExtensionIcon from "@mui/icons-material/Extension";

const GamepadContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "300px",
  width: "400px",
  borderRadius: "20px",
  padding: "20px",
  gap: "20px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
});

const DPad = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(3, 60px)",
  gridTemplateRows: "repeat(3, 60px)",
  gap: "5px",
});

const GameButton = styled(Button)({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
});

const ActionButtons = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 60px)",
  gridTemplateRows: "repeat(2, 60px)",
  gap: "10px",
});

const Gamepad: React.FC = () => {
  return (
    <GamepadContainer>
      <DPad>
        <GameButton disabled />
        <GameButton>
          <ArrowUpwardIcon />
        </GameButton>
        <GameButton disabled />
        <GameButton>
          <ArrowBackIcon />
        </GameButton>
        <GameButton>
          <ExtensionIcon />
        </GameButton>
        <GameButton>
          <ArrowForwardIcon />
        </GameButton>
        <GameButton disabled />
        <GameButton>
          <ArrowDownwardIcon />
        </GameButton>
        <GameButton disabled />
      </DPad>
      <ActionButtons>
        <GameButton>A</GameButton>
        <GameButton>B</GameButton>
        <GameButton>X</GameButton>
        <GameButton>Y</GameButton>
      </ActionButtons>
    </GamepadContainer>
  );
};

export default Gamepad;
