import CloudOffIcon from "@mui/icons-material/CloudOff";
import { Box, Typography } from "@mui/material";

export default function NoWalls() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: "10vh",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.3)",
        },
      }}
    >
      <CloudOffIcon sx={{ fontSize: 80, color: "primary.dark" }} />
      <Typography variant="h5" align="center" mt={2}>
        연결된 Wall이 없습니다.
      </Typography>
    </Box>
  );
}
