import React from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useState, useEffect } from "react";
import { parseStringPromise } from "xml2js";

import { ContentObject, Instance } from "../interfaces/xmlResponses";

import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";
import { mockMedias } from "../test/mockMedias";

const RefreshButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

interface Position {
  x: number;
  y: number;
}

type PositionsMap = { [key: string]: Position };

const MediaPanel: React.FC = () => {
  const [medias, setMedias] = useState<ContentObject[]>(mockMedias);
  const [refreshKey, setRefreshKey] = useState(0);
  const [positions, setPositions] = useState<PositionsMap>({});

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
    fetchWrapper(xmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => setMedias(parsedData.Objects.Object))
      .catch((error) => console.log("failed to parse xml", error));
    setPositions(
      medias.reduce((acc: PositionsMap, media: ContentObject) => {
        media.Instance.forEach((instance: Instance) => {
          const [x, y] = instance.position.split(",").map(Number);
          acc[instance.id] = { x, y };
        });
        return acc;
      }, {})
    );
  }, [refreshKey]);

  return (
    <Container>
      <RefreshButton aria-label="refresh" onClick={handleRefresh}>
        <RefreshRoundedIcon />
      </RefreshButton>
      {medias.length === 0 ? (
        <Typography>선택된 미디어가 없습니다.</Typography>
      ) : (
        medias.map((media, index) =>
          media.Instance.map((instance) => (
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
        )
      )}
    </Container>
  );
};

export default MediaPanel;
