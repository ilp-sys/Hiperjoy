import React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";

const HoverableBox = styled(Box)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const HoverBox: React.FC = () => {
  return (
    <HoverableBox
      sx={{
        width: 100,
        height: 100,
        backgroundColor: "primary.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Hover me!
    </HoverableBox>
  );
};

export default HoverBox;
