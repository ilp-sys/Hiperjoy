import CloudOffIcon from "@mui/icons-material/CloudOff";
import { Box, Typography } from "@mui/material";

export default function NoWalls() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt="5vh"
    >
      <CloudOffIcon sx={{ fontSize: 80, color: "primary.dark" }} />
      <Typography variant="h5" align="center" mt={2}>
        연결된 Wall이 없습니다.
      </Typography>
    </Box>
  );
}
