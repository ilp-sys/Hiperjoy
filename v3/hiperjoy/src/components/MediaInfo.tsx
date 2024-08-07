import { Card, CardContent, Typography, Grid } from "@mui/material";
import { currentMediaState } from "../recoil-states";
import { useRecoilValue } from "recoil";

export default function MediaInfo() {
  const currentMedia = useRecoilValue(currentMediaState);
  if (!currentMedia) return <></>;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Content Object: {currentMedia.name}
        </Typography>
        <Typography variant="subtitle1">Type: {currentMedia.type}</Typography>
        <Typography variant="subtitle1">
          Dimensions: {currentMedia.width} x {currentMedia.height}
        </Typography>
        {currentMedia.uuid && (
          <Typography variant="subtitle1">UUID: {currentMedia.uuid}</Typography>
        )}
        {currentMedia.said && (
          <Typography variant="subtitle1">SAID: {currentMedia.said}</Typography>
        )}
        {currentMedia.label && (
          <Typography variant="subtitle1">
            Label: {currentMedia.label}
          </Typography>
        )}

        <Typography variant="h6" gutterBottom>
          Instance Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>ID:</strong> {currentMedia.id}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Position:</strong> {currentMedia.position}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Size:</strong> {currentMedia.size}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Rotation:</strong> {currentMedia.rotation}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Transparency:</strong> {currentMedia.transparency}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>RGB:</strong> {currentMedia.rgb}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>BW:</strong> {currentMedia.bw}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Mosaic:</strong> {currentMedia.mosaic}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Layer:</strong> {currentMedia.layer}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Audio:</strong> {currentMedia.audio || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Show Label:</strong>{" "}
              {currentMedia.showlabel ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Border RGB:</strong> {currentMedia.borderRGB}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Border Visibility:</strong> {currentMedia.bordervis}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
