import { Divider } from "@mui/material";

import Gamepad from "../components/Gamepad";
import MediaPanel from "../components/MediaPanel";
import FeedsUtilityButtons from "../components/FeedsUtilityButtons";

export default function FeedsScreen() {
  return (
    <>
      <FeedsUtilityButtons />
      <Divider />
      <MediaPanel />
      {/* <Gamepad /> */}
    </>
  );
}
