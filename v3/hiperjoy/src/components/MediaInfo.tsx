import { Card, CardContent, Divider, Typography, Grid } from "@mui/material";
import { useCurrentInstance } from "../utils/useCurrentInstance";

export default function MediaInfo() {
  const currentInstance = useCurrentInstance();

  if (!currentInstance) {
    return (
      <Card sx={{ height: "43vh" }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            No instance selected or instance not found.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "43vh" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Instance Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>ID:</strong> {currentInstance.id}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Position:</strong> {currentInstance.position}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Size:</strong> {currentInstance.size}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Rotation:</strong> {currentInstance.rotation}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Transparency:</strong> {currentInstance.transparency}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>RGB:</strong> {currentInstance.rgb}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>BW:</strong> {currentInstance.bw}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Mosaic:</strong> {currentInstance.mosaic}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Layer:</strong> {currentInstance.layer}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Audio:</strong> {currentInstance.audio || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Show Label:</strong>{" "}
              {currentInstance.showlabel ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Border RGB:</strong> {currentInstance.borderRGB}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Border Visibility:</strong> {currentInstance.bordervis}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
