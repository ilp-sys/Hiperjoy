import Gamepad from "../components/Gamepad";
import MediaPanel from "../components/MediaPanel";
import HoverBox from "../components/HoverBox";
import FeedsUtilityButtons from "../components/FeedsUtilityButtons";

export default function () {
  return (
    <>
      <FeedsUtilityButtons />
      <HoverBox />
      <MediaPanel />
      <Gamepad />
    </>
  );
}
