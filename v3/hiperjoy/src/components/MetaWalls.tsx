import { useEffect, useState } from "react";
import { parseStringPromise } from "xml2js";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";

import { fetchWrapper } from "../utils/fetchers";
import { Wall } from "../interfaces/xmlResponses";
import { buildXml } from "../utils/buildXml";

// const parseXML = async (xml: string): Promise<Wall[]> => {
//   const result = await parseStringPromise(xml, { explicitArray: false });
//   return result.Walls.Wall.map((wall: any) => ({
//     name: wall.name,
//     left: parseFloat(wall.left),
//     top: parseFloat(wall.top),
//     width: parseFloat(wall.width),
//     height: parseFloat(wall.height),
//     color: wall.color,
//     wallgridh: wall.wallgridh ? parseInt(wall.wallgridh) : undefined,
//     wallgridv: wall.wallgridv ? parseInt(wall.wallgridv) : undefined,
//   }));
// };

const MetaWalls: React.FC = () => {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const xmlPayload = buildXml("Commands", {
    action: {
      "@type": "walls",
    },
  });

  useEffect(() => {
    fetchWrapper(xmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => {
        setWalls(parsedData);
        console.log(parsedData);
      })
      .catch((error) => console.log("failed to parse xml", error));
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Walls Information
      </Typography>
      <Grid container spacing={2}>
        {walls.map((wall, index) => (
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
        ))}
      </Grid>
    </Container>
  );
};

export default MetaWalls;
