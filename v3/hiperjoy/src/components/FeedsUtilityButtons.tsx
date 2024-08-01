import { useState } from "react";

import { ButtonGroup, IconButton } from "@mui/material";
import { VolumeOff, VolumeUp } from "@mui/icons-material";

import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";

export default function FeedsUtilityButtons() {
  const [muteState, setMuteState] = useState(false);

  const muteXmlPayload = buildXml("Commands", {
    action: {
      "@type": "mute-all",
    },
  });

  const unmuteXmlPayload = buildXml("Commands", {
    action: {
      "@type": "unmute-all",
    },
  });

  const handleMuteClick = () => {
    fetchWrapper(muteState ? muteXmlPayload : unmuteXmlPayload).then(
      (response) => console.log(response)
    );
    setMuteState(!muteState);
  };

  return (
    <ButtonGroup variant="outlined" aria-label="Basic button group">
      <IconButton
        aria-label="mute"
        onClick={handleMuteClick}
        size="large"
        color="primary"
      >
        {muteState ? (
          <VolumeOff fontSize="inherit" />
        ) : (
          <VolumeUp fontSize="inherit" />
        )}
      </IconButton>
    </ButtonGroup>
  );
}
