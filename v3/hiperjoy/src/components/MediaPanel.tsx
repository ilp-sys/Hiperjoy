import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Container, Typography } from "@mui/material";

import { ContentObject, Instance } from "../interfaces/xmlResponses";
import { PositionsMap, ScalesMap } from "../interfaces/utilTypes";
import { selectedMediasState } from "../recoil-states";
import { MediaItem } from "./MediaItem";
import { mockMedias } from "../test/mockMedias";

const useMediaDragAndScale = (selectedMedias: ContentObject[]) => {
  const [positions, setPositions] = useState<PositionsMap>({});
  const [scales, setScales] = useState<ScalesMap>({});

  useEffect(() => {
    const newPositions: PositionsMap = selectedMedias.reduce(
      (acc: PositionsMap, media: ContentObject) => {
        media.Instance.forEach((instance: Instance) => {
          const [x, y] = instance.position.split(",").map(Number);
          acc[instance.id] = { x, y };
        });
        return acc;
      },
      {}
    );

    setPositions(newPositions);
  }, [selectedMedias]);

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
      [id]: { x: event.clientX, y: event.clientY },
    }));
  };

  const handleDragEnd = (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;

    const { offsetX, offsetY } = JSON.parse(data);
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: {
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      },
    }));
  };

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

  return {
    positions,
    scales,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleWheel,
  };
};

const MediaPanel: React.FC = () => {
  const selectedMedias = useRecoilValue(selectedMediasState);
  const {
    positions,
    scales,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleWheel,
  } = useMediaDragAndScale(selectedMedias);
  const [hoveredId, setHoveredId] = useState<string>("");

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
        selectedMedias.flatMap((media) =>
          media.Instance.map((instance) => (
            <MediaItem
              key={instance.id}
              media={media}
              instance={instance}
              position={positions[instance.id] || { x: 0, y: 0 }}
              scale={scales[instance.id] || 1}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onWheel={handleWheel}
              isHovered={hoveredId === instance.id}
              onMouseEnter={setHoveredId}
              onMouseLeave={() => setHoveredId("")}
            />
          ))
        )
      )}
    </Container>
  );
};

export default MediaPanel;
