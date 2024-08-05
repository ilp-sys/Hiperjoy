import React from "react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Box, Container, Typography } from "@mui/material";

import { ContentObject, Instance } from "../interfaces/xmlResponses";
import { Position, PositionsMap } from "../interfaces/utiilTypes";
import { selectedMediasState } from "../recoil-states";

import { mockMedias } from "../test/mockMedias";

const MediaPanel: React.FC = () => {
  const [positions, setPositions] = useState<PositionsMap>({});
  const selectedMedias = useRecoilValue(selectedMediasState);

  const contentsDefaultPath = "C:\\Users\\Public\\HiperWall\\contents\\";

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id, offsetX, offsetY })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, id: string) => {
    if (event.clientX === 0 && event.clientY === 0) return;
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: {
        x: event.clientX,
        y: event.clientY,
      },
    }));
  };

  const handleDragEnd = (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    const data = event.dataTransfer.getData("application/json");
    if (!data) {
      console.warn("No data found in dataTransfer");
      return;
    }

    const { offsetX, offsetY } = JSON.parse(data);
    if (typeof offsetX !== "number" || typeof offsetY !== "number") {
      console.warn("Invalid data format");
      return;
    }
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: {
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      },
    }));
  };

  useEffect(() => {
    setPositions(
      selectedMedias.reduce((acc: PositionsMap, media: ContentObject) => {
        media.Instance.forEach((instance: Instance) => {
          const [x, y] = instance.position.split(",").map(Number);
          acc[instance.id] = { x, y };
        });
        return acc;
      }, {})
    );
  }, [selectedMedias]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {selectedMedias.length === 0 ? (
        <Typography color="text.secondary" mt="20vh">
          선택된 미디어가 없습니다.
        </Typography>
      ) : (
        selectedMedias.map((selectedMedia, index) =>
          selectedMedia.Instance.map((instance) => (
            <Box
              key={index}
              mb={2}
              draggable
              onDragStart={(event) => handleDragStart(event, instance.id)}
              onDrag={(event) => handleDrag(event, instance.id)}
              onDragEnd={(event) => handleDragEnd(event, instance.id)}
              style={{
                cursor: "grab",
                position: "absolute",
                left: `${positions[instance.id]?.x}px`,
                top: `${positions[instance.id]?.y}px`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {selectedMedia.type == "Image" && (
                <img
                  src={`file:\\${contentsDefaultPath}${selectedMedia.name}`}
                  alt={`media-${index}`}
                  style={{ width: "100%" }}
                />
              )}
              {selectedMedia.type == "Movie" && (
                <video
                  src={`file:\\${contentsDefaultPath}${selectedMedia.name}`}
                  controls
                  style={{ width: "100%" }}
                />
              )}
            </Box>
          ))
        )
      )}
    </Container>
  );
};

export default MediaPanel;
