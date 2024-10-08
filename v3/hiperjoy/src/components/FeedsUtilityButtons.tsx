import { useEffect, useState } from "react";

import { ButtonGroup, IconButton } from "@mui/material";
import { VolumeOff, VolumeUp, Refresh } from "@mui/icons-material";

import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";

import { useRefreshSelectedMedias } from "../utils/useRefreshSelectedMedias";

export default function FeedsUtilityButtons() {
  const [muteState, setMuteState] = useState(false);
  const refreshSelectedMedias = useRefreshSelectedMedias();

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
    fetchWrapper(muteState ? muteXmlPayload : unmuteXmlPayload)
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
    setMuteState(!muteState);
  };

  useEffect(() => {
    refreshSelectedMedias();
  }, [refreshSelectedMedias]);

  return (
    <ButtonGroup variant="text" aria-label="feeds utility buttons">
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
      <IconButton
        aria-label="refresh"
        onClick={refreshSelectedMedias}
        size="large"
        color="primary"
      >
        <Refresh />
      </IconButton>
    </ButtonGroup>
  );
}
