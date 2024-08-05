import React, { useState } from "react";
import { Paper, Box, Button, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import {
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
  Extension,
  Minimize,
  Maximize,
} from "@mui/icons-material";

const GamepadContainer = styled(Box)(({ theme }) => ({
  position: "relative",
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
  transition: "all 0.3s ease-in-out",
}));

const MinimizedContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "60px",
  width: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
}));

const DPad = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(3, 60px)",
  gridTemplateRows: "repeat(3, 60px)",
  gap: "5px",
});

const GameButton = styled(Button)(({ theme }) => ({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  transition: "all 0.2s",
}));

const ActionButton = styled(GameButton)({
  width: "70px",
  height: "70px",
});

const ActionButtons = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 70px)",
  gridTemplateRows: "repeat(2, 70px)",
  gap: "10px",
});

const MinimizeButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

const Gamepad: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <>
      {isMinimized ? (
        <MinimizedContainer onClick={toggleMinimize}>
          <Maximize />
        </MinimizedContainer>
      ) : (
        <GamepadContainer>
          <MinimizeButton onClick={toggleMinimize}>
            <Minimize />
          </MinimizeButton>
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
            <ActionButton>A</ActionButton>
            <ActionButton>B</ActionButton>
            <ActionButton>X</ActionButton>
            <ActionButton>Y</ActionButton>
          </ActionButtons>
        </GamepadContainer>
      )}
    </>
  );
};

export default Gamepad;
