import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { styled } from "@mui/system";

import {
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
  Extension,
  Minimize,
} from "@mui/icons-material";

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

const MinimizeButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

const Gamepad: React.FC = () => {
  const handleMinimizeClick = () => {
    console.log("minizied!");
  };
  return (
    <GamepadContainer>
      <MinimizeButton onClick={handleMinimizeClick} />
      <DPad>
        <GameButton disabled />
        <GameButton>
          <ArrowUpward />
        </GameButton>
        <GameButton disabled />
        <GameButton>
          <ArrowBack />
        </GameButton>
        <GameButton>
          <Extension />
        </GameButton>
        <GameButton>
          <ArrowForward />
        </GameButton>
        <GameButton disabled />
        <GameButton>
          <ArrowDownward />
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
