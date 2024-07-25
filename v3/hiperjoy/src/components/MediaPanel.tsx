import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useState, useEffect } from "react";
import { parseStringPromise } from "xml2js";

import {
  ObjectsResponse,
  ContentObject,
  Instance,
} from "../interfaces/xmlResponses";

import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";

const MediaContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "200px",
  width: "300px",
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

const MediaPanel: React.FC = () => {
  const [media, setMedia] = useState<ContentObject[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

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

  useEffect(() => {
    fetchWrapper(xmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => {
        setMedia(parsedData.Objects.Object);
      })
      .catch((error) => console.log("failed to parse xml", error));
  }, [refreshKey]);

  return (
    <MediaContainer>
      <RefreshButton aria-label="refresh" onClick={handleRefresh}>
        <RefreshRoundedIcon />
      </RefreshButton>
      {media.length === 0 ? (
        <Typography>선택된 미디어가 없습니다.</Typography>
      ) : (
        media.map((item, index) => (
          <Box key={index} mb={2}>
            {item.type == "Image" && (
              <img
                src={"file:\\" + `${contentsDefaultPath}` + `${item.name}`}
                alt={`media-${index}`}
                style={{ width: "100%" }}
              />
            )}
            {item.type == "Movie" && (
              <video
                src={"file:\\" + `${contentsDefaultPath}` + `${item.name}`}
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
