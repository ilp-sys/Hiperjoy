import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { Delete, VolumeOff } from "@mui/icons-material";
import { ContentObject, Instance } from "../interfaces/xmlResponses";
import { PositionsMap, ScalesMap } from "../interfaces/utilTypes";
import { selectedMediasState } from "../recoil-states";
import { mockMedias } from "../test/mockMedias";

const contentsDefaultPath = "C:\\Users\\Public\\HiperWall\\contents\\";

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

const MediaItem: React.FC<{
  media: any;
  instance: Instance;
  position: { x: number; y: number };
  scale: number;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDrag: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onWheel: (event: React.WheelEvent<HTMLDivElement>, id: string) => void;
  isHovered: boolean;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
}> = ({
  media,
  instance,
  position,
  scale,
  onDragStart,
  onDrag,
  onDragEnd,
  onWheel,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Box
    draggable
    onDragStart={(event) => onDragStart(event, instance.id)}
    onDrag={(event) => onDrag(event, instance.id)}
    onDragEnd={(event) => onDragEnd(event, instance.id)}
    onMouseEnter={() => onMouseEnter(instance.id)}
    onMouseLeave={onMouseLeave}
    onWheel={(event) => onWheel(event, instance.id)}
    sx={{
      cursor: "grab",
      position: "absolute",
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: `translate(-50%, -50%) scale(${isHovered ? 1.3 : scale})`,
      transition: "transform 0.1s",
      border: isHovered ? "1px solid #1945E8" : "none",
    }}
  >
    {media.type === "Image" && (
      <img
        src={`file:\\${contentsDefaultPath}${media.name}`}
        alt={`media-${instance.id}`}
        style={{ width: "100%" }}
      />
    )}
    {media.type === "Movie" && (
      <video
        src={`file:\\${contentsDefaultPath}${media.name}`}
        controls
        style={{ width: "100%" }}
      />
    )}
    {isHovered && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          transition: "opacity 0.2s",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "4px",
        }}
      >
        <IconButton size="small" color="inherit" sx={{ color: "#fff" }}>
          <Delete />
        </IconButton>
        <IconButton size="small" color="inherit" sx={{ color: "#fff" }}>
          <VolumeOff />
        </IconButton>
      </Box>
    )}
  </Box>
);

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
