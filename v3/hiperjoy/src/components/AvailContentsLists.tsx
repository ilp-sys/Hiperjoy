import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAll";
import ImageIcon from "@mui/icons-material/Image";
import { parseStringPromise } from "xml2js";

import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";
import { StyledListItem } from "./StyledListItem";
import { Instance } from "../interfaces/xmlResponses";

const NoContentsAvailable = () => (
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

const ContentListItem = ({ content }: { content: Instance }) => (
  <StyledListItem>
    <ListItemAvatar>
      <ImageIcon />
    </ListItemAvatar>
    <ListItemText
      primary={content.position}
      secondary={
        <>
          <Typography component="span" variant="body2" color="text.primary">
            Size: {content.size} | Rotation: {content.rotation}° | Transparency:{" "}
            {content.transparency}
          </Typography>
          <br />
          <Typography component="span" variant="body2" color="text.primary">
            Color: {content.rgb} | BW: {content.bw} | Mosaic: {content.mosaic} |
            Layer: {content.layer}
          </Typography>
          {content.audio && (
            <>
              <br />
              <Typography component="span" variant="body2" color="text.primary">
                Audio: {content.audio}
              </Typography>
            </>
          )}
        </>
      }
    />
  </StyledListItem>
);

export default function AvailContentsLists() {
  const [availContents, setAvailContents] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listXmlPayload = buildXml("Commands", {
    action: {
      "@type": "list",
      filter: "notopen",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWrapper(listXmlPayload);
        const parsedData = await parseStringPromise(response);
        setAvailContents(parsedData.Objects.Object);
      } catch (error) {
        setError("Failed to fetch or parse data");
        console.error("Failed to fetch or parse XML", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listXmlPayload]);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <>
      {availContents.length === 0 ? (
        <NoContentsAvailable />
      ) : (
        <>
          <Typography variant="overline" gutterBottom color="primary.light">
            {availContents.length} contents available
          </Typography>
          <List>
            {availContents.map((content) => (
              <ContentListItem key={content.id} content={content} />
            ))}
          </List>
        </>
      )}
    </>
  );
}
