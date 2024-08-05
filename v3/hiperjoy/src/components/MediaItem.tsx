import { Box, IconButton } from "@mui/material";
import { Delete, VolumeOff } from "@mui/icons-material";
import { Instance } from "../interfaces/xmlResponses";

const contentsDefaultPath = "C:\\Users\\Public\\HiperWall\\contents\\";

export const MediaItem: React.FC<{
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
