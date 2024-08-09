import React from "react";
import { Container, IconButton, Typography } from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { useRecoilValue } from "recoil";

import { currentContentObjectState } from "../recoil-states";

const contentsDefaultPath = "C:\\Users\\Public\\HiperWall\\contents\\";

const MediaPanel: React.FC = () => {
  const currentContentObject = useRecoilValue(currentContentObjectState);

  if (!currentContentObject) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <Typography color="text.secondary" mt="10vh">
          선택된 미디어가 없습니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        width: "100%",
      }}
    >
      {/* Media Content */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentContentObject.type === "Image" && (
            <img
              src={`file:\\${contentsDefaultPath}${currentContentObject.name}`}
              alt="Media Content"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
          {currentContentObject.type === "Movie" && (
            <video
              src={`file:\\${contentsDefaultPath}${currentContentObject.name}`}
              controls
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </div>

        {/* Arrow Buttons */}
        <IconButton
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <ArrowUpward />
        </IconButton>
        <IconButton
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <ArrowDownward />
        </IconButton>
        <IconButton
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ArrowForward />
        </IconButton>
      </div>
    </Container>
  );
};

export default MediaPanel;
