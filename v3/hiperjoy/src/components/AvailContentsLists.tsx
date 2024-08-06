import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAll";
import ImageIcon from "@mui/icons-material/Image";
import { parseStringPromise } from "xml2js";

import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";
import { StyledListItem } from "./StyleListItem";

function NoContentsAvailabel() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: "5vh",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.3)",
        },
      }}
    >
      <ClearAllRoundedIcon sx={{ fontSize: 80, color: "primary.dark" }} />
      <Typography variant="h6" align="center" mt={2}>
        사용가능한 컨텐츠가 없습니다.
      </Typography>
    </Box>
  );
}

export default function AvailContentsLists() {
  const [availContents, setAvailContents] = useState([]);
  const listXmlPayload = buildXml("Commands", {
    action: {
      "@type": "list",
      filter: "notopen",
    },
  });

  useEffect(() => {
    fetchWrapper(listXmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => setAvailContents(parsedData))
      .catch((error) => console.error("failed to parse xml", error));
  }, []);
  return (
    <>
      {availContents.length === 0 ? (
        <NoContentsAvailabel />
      ) : (
        <>
          <Typography variant="overline" gutterBottom color="primary.light">
            {availContents.length} contents available
          </Typography>
          <List>
            {availContents.map((content, index) => (
              <StyledListItem>
                <ListItemAvatar>
                  <ImageIcon />
                </ListItemAvatar>
                <ListItemText></ListItemText>
              </StyledListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
}
