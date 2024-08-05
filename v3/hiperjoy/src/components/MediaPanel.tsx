import React from "react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Box, Container, Typography, IconButton } from "@mui/material";
import { Delete, VolumeOff } from "@mui/icons-material";

import { ContentObject, Instance } from "../interfaces/xmlResponses";
import { PositionsMap, ScalesMap } from "../interfaces/utiilTypes";
import { selectedMediasState } from "../recoil-states";

import { mockMedias } from "../test/mockMedias";

const MediaPanel: React.FC = () => {
  const [positions, setPositions] = useState<PositionsMap>({});
  const [hoveredId, setHoveredId] = useState<string>("");
  const [scales, setScales] = useState<ScalesMap>({});
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

  const handleMouseEnter = (id: string) => setHoveredId(id);
  const handleMouseLeave = () => setHoveredId("");

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>, id: string) => {
    const delta = event.deltaY;
    setScales((prevScales) => {
      const currentScale = prevScales[id] || 1;
      const newScale = Math.min(
        Math.max(currentScale + (delta > 0 ? -0.1 : 0.1), 0.5),
        2
      );
      return { ...prevScales, [id]: newScale };
    });
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
              onMouseEnter={() => handleMouseEnter(instance.id)}
              onMouseLeave={handleMouseLeave}
              onWheel={(event) => handleWheel(event, instance.id)}
              style={{
                cursor: "grab",
                position: "absolute",
                left: `${positions[instance.id]?.x}px`,
                top: `${positions[instance.id]?.y}px`,
                transform: `translate(-50%, -50%) scale(${
                  hoveredId === instance.id ? 1.3 : scales[instance.id] || 1
                })`,
                transition: "transform 0.1s",
                border:
                  hoveredId === instance.id ? "1px solid #1945E8" : "none",
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
              {hoveredId === instance.id && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    transition: "opacity 0.3s",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "4px",
                  }}
                >
                  <IconButton
                    size="small"
                    color="inherit"
                    sx={{ color: "#fff" }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="inherit"
                    sx={{ color: "#fff" }}
                  >
                    <VolumeOff />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))
        )
      )}
    </Container>
  );
};

export default MediaPanel;
