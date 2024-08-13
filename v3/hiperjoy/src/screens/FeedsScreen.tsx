import { Box, Divider } from "@mui/material";

import FeedsUtilityButtons from "../components/FeedsUtilityButtons";
import MediaBoard from "../components/MediaBoard";
import MediaItemUtilButtons from "../components/MediaItemUtilButtons";
import MediaPanel from "../components/MediaPanel";
import MediaInfo from "../components/MediaInfo";

export default function FeedsScreen() {
  return (
    <>
      <FeedsUtilityButtons />
      <MediaBoard />
      <Divider sx={{ mb: 1 }} />
      <MediaItemUtilButtons />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          mt: 2,
          gap: 2,
        }}
      >
        <MediaPanel />
        <MediaInfo />
      </Box>
    </>
  );
}
