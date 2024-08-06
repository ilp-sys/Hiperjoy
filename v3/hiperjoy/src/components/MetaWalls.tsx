import { useEffect, useState } from "react";
import { parseStringPromise } from "xml2js";

import {
  Container,
  Divider,
  Typography,
  List,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import FourKIcon from "@mui/icons-material/FourK";

import { fetchWrapper } from "../utils/fetchers";
import { Wall } from "../interfaces/xmlResponses";
import { buildXml } from "../utils/buildXml";
import NoWallsConnected from "./NoWallsConnected";
import { StyledListItem } from "./StyleListItem";

const MetaWalls: React.FC = () => {
  const [walls, setWalls] = useState<Wall[]>([]);

  const xmlPayload = buildXml("Commands", {
    action: {
      "@type": "walls",
    },
  });

  useEffect(() => {
    fetchWrapper(xmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => setWalls(parsedData.Walls.Wall))
      .catch((error) => console.log("failed to parse xml", error));
  }, []);

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        mt="5vh"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        하이퍼월 연결 정보 표시
      </Typography>
      <Divider />
      {walls.length === 0 ? (
        <NoWallsConnected />
      ) : (
        <>
          <Typography variant="overline" gutterBottom color="primary.light">
            {walls.length} walls connected
          </Typography>
          <List>
            {walls.map((wall, index) => (
              <StyledListItem key={index} alignItems="flex-start">
                <ListItemAvatar>
                  <FourKIcon />
                </ListItemAvatar>
                <ListItemText
                  primary={wall.name}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Left:</strong> {wall.left} &nbsp;
                        <strong>Top:</strong> {wall.top} &nbsp;
                        <strong>Width:</strong> {wall.width} &nbsp;
                        <strong>Height:</strong> {wall.height} &nbsp;
                        <strong>Color:</strong> {wall.color}
                      </Typography>
                      {wall.wallgridh !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Grid H:</strong> {wall.wallgridh}
                        </Typography>
                      )}
                      {wall.wallgridv !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Grid V:</strong> {wall.wallgridv}
                        </Typography>
                      )}
                    </>
                  }
                />
              </StyledListItem>
            ))}
          </List>
        </>
      )}
    </Container>
  );
};

export default MetaWalls;
