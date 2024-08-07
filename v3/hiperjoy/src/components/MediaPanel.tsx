import { Container } from "@mui/material";
import { useRecoilValue } from "recoil";

import { currentMediaState } from "../recoil-states";

const MediaPanel: React.FC = () => {
  const currentMedia = useRecoilValue(currentMediaState);

  return (
    <Container>
      <div>media panel</div>
    </Container>
  );
};

export default MediaPanel;
