import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Box, Container, IconButton, Typography } from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

import { thumbnailsState } from "../recoil-states";
import { useCurrentInstance } from "../utils/useCurrentInstance";
import { currentContentObjectState } from "../recoil-states";

const MediaPanel: React.FC = () => {
  const currentInstance = useCurrentInstance();
  const thumbnails = useRecoilValue(thumbnailsState);
  const currentContentObject = useRecoilValue(currentContentObjectState);
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (currentContentObject) {
      setImgSrc(thumbnails[currentContentObject.name]);
    }
  }, [currentContentObject, thumbnails]);

  if (!currentInstance) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
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
    <>
      {/* Media Content */}
      <div style={{ position: "relative" }}>
        <Box
          sx={{
            width: "300px",
            height: "300px",
            backgroundColor: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={imgSrc}
            alt="Media Content"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>

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
    </>
  );
};

export default MediaPanel;
