import { Divider, Typography, Container } from "@mui/material";

import AvailContentsLists from "../components/AvailContentsLists";

export default function FoldersScreen() {
  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        mt="5vh"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Available Contents
      </Typography>
      <Divider />
      <AvailContentsLists />
    </Container>
  );
}
