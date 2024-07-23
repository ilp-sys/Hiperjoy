import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
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

const MediaPanel: React.FC = () => {
  const [media, setMedia] = useState<ContentObject[]>([]);

  const xmlPayload = buildXml("Commands", {
    action: {
      "@type": "list",
      filter: "type=Streamer;notopen",
    },
  });
  useEffect(() => {
    fetchWrapper(xmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => setMedia(parsedData))
      .catch((error) => console.log("failed to parse xml"));
  }, []);

  return (
    <MediaContainer>
      {media.length === 0 ? (
        <Typography>선택된 미디어가 없습니다.</Typography>
      ) : (
        media.map((item, index) => (
          <Box key={index} mb={2}>
            {item.type === "image" && (
              <img
                src={item.name}
                alt={`media-${index}`}
                style={{ width: "100%" }}
              />
            )}
            {item.type === "video" && (
              <video src={item.name} controls style={{ width: "100%" }} />
            )}
          </Box>
        ))
      )}
    </MediaContainer>
  );
};

export default MediaPanel;
