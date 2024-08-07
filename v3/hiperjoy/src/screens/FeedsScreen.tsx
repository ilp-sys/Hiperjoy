import { Divider, Stack } from "@mui/material";

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
      <Divider />
      <MediaItemUtilButtons />
      <MediaPanel />
      <MediaInfo />
    </>
  );
}
