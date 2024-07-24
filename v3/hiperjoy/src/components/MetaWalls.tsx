import { useEffect, useState } from "react";
import { parseStringPromise } from "xml2js";

import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { styled } from '@mui/system';

import { fetchWrapper } from "../utils/fetchers";
import { Wall } from "../interfaces/xmlResponses";
import { buildXml } from "../utils/buildXml";

const MetaWallsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100px",
  width: "200px",
  borderRadius: "20px",
  padding: "20px",
  gap: "20px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
});


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
      .then((parsedData) => setWalls(parsedData.Walls))
      .catch((error) => console.log("failed to parse xml", error));
  }, []);

  return (
    <MetaWallsContainer>
      <Typography variant="h4" gutterBottom>
        Walls 정보
      </Typography>
      <Grid container spacing={2}>
        {walls.length === 0 ? (
          <Typography>연결된 Wall이 없습니다.</Typography>
        ) : (
          walls.map((wall, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {wall.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Left:</strong> {wall.left}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Top:</strong> {wall.top}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Width:</strong> {wall.width}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Height:</strong> {wall.height}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Color:</strong> {wall.color}
                  </Typography>
                  {wall.wallgridh !== undefined && (
                    <Typography variant="body1">
                      <strong>Grid H:</strong> {wall.wallgridh}
                    </Typography>
                  )}
                  {wall.wallgridv !== undefined && (
                    <Typography variant="body1">
                      <strong>Grid V:</strong> {wall.wallgridv}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </MetaWallsContainer>
  );
};

export default MetaWalls;
