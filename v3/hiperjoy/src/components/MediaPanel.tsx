import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useState, useEffect } from "react";
import { parseStringPromise } from "xml2js";

import { ContentObject, Instance } from "../interfaces/xmlResponses";

import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";

const MediaContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
});

const RefreshButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

const mockMedias: ContentObject[] = [
  {
    name: "Image\\image\\pexels-amol-mande-2683946.jpg.tif",
    type: "Image",
    width: 6016,
    height: 4000,
    Instance: [
      {
        id: "HWobj636920446.9",
        position: "-1510.5752,-589.1223",
        size: "2500.0,1667.0",
        rotation: 0.0,
        transparency: 1.0,
        rgb: "1.0,1.0,1.0",
        bw: 0.0,
        mosaic: 0.0,
        layer: 2,
        showlabel: false,
        borderRGB: "0088ce",
        bordervis: 0,
      },
    ],
  },
  {
    name: "Image\\MMI\\이력트렌드.jpg",
    type: "Image",
    width: 1920,
    height: 1080,
    Instance: [
      {
        id: "HWobj-1165174442.3",
        position: "-4531.7207,780.4593",
        size: "2500.0,1412.0",
        rotation: 0.0,
        transparency: 1.0,
        rgb: "1.0,1.0,1.0",
        bw: 0.0,
        mosaic: 0.0,
        layer: 1,
        showlabel: false,
        borderRGB: "0088ce",
        bordervis: 0,
      },
    ],
  },
  {
    name: "video\\Hiperwall Software Demo _ Korean Version_hd(1080p).mp4.hwv",
    type: "Movie",
    width: 1920,
    height: 1080,
    label: "HIPERWALL GUIDE",
    Instance: [
      {
        id: "HWobj-1293972907.10",
        position: "2754.28,1298.6661",
        size: "6156.0,3478.0",
        rotation: 0.0,
        transparency: 1.0,
        rgb: "1.0,1.0,1.0",
        bw: 0.0,
        mosaic: 0.0,
        layer: 3,
        audio: "0,unmuted",
        showlabel: true,
        borderRGB: "0088ce",
        bordervis: 0,
      },
    ],
  },
];

const MediaPanel: React.FC = () => {
  //const [medias, setMedias] = useState<ContentObject[]>([]);
  const [medias, setMedias] = useState<ContentObject[]>(mockMedias);
  const [refreshKey, setRefreshKey] = useState(0);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  const contentsDefaultPath = "C:\\Users\\Public\\HiperWall\\contents\\";

  const xmlPayload = buildXml("Commands", {
    action: {
      "@type": "list",
      filter: "open",
    },
  });

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

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
    const { offsetX, offsetY } = JSON.parse(
      event.dataTransfer.getData("application/json")
    );
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: {
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      },
    }));
  };

  useEffect(() => {
    fetchWrapper(xmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => setMedias(parsedData.Objects.Object))
      .catch((error) => console.log("failed to parse xml", error));
    setPositions(
      medias.reduce((acc, media) => {
        acc[media.Instance.id] = { x: 0, y: 0 };
        return acc;
      }, {})
    );
  }, [refreshKey]);

  return (
    <MediaContainer>
      <RefreshButton aria-label="refresh" onClick={handleRefresh}>
        <RefreshRoundedIcon />
      </RefreshButton>
      {medias.length === 0 ? (
        <Typography>선택된 미디어가 없습니다.</Typography>
      ) : (
        medias.map((media, index) => (
          <Box
            key={index}
            mb={2}
            draggable
            onDragStart={(event) => handleDragStart(event, media.Instance.id)}
            onDrag={(event) => handleDrag(event, media.Instance.id)}
            onDragEnd={(event) => handleDragEnd(event, media.Instance.id)}
            style={{
              cursor: "grab",
              position: "absolute",
              left: `${positions[media.Instance.id]?.x}px`,
              top: `${positions[media.Instance.id]?.y}px`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {media.type == "Image" && (
              <img
                src={"file:\\" + `${contentsDefaultPath}` + `${media.name}`}
                alt={`media-${index}`}
                style={{ width: "100%" }}
              />
            )}
            {media.type == "Movie" && (
              <video
                src={"file:\\" + `${contentsDefaultPath}` + `${media.name}`}
                controls
                style={{ width: "100%" }}
              />
            )}
          </Box>
        ))
      )}
    </MediaContainer>
  );
};

export default MediaPanel;
