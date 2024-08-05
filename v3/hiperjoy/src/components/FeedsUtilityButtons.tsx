import { useState } from "react";

import { ButtonGroup, IconButton } from "@mui/material";
import { VolumeOff, VolumeUp, Refresh } from "@mui/icons-material";

import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";
import { selectedMediasState } from "../recoil-states";

import { parseStringPromise } from "xml2js";
import { useSetRecoilState } from "recoil";

export default function FeedsUtilityButtons() {
  const [muteState, setMuteState] = useState(false);
  const setSelectedMedias = useSetRecoilState(selectedMediasState);

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

  const listXmlPayload = buildXml("Commands", {
    action: {
      "@type": "list",
      filter: "open",
    },
  });

  const handleMuteClick = () => {
    fetchWrapper(muteState ? muteXmlPayload : unmuteXmlPayload)
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
    setMuteState(!muteState);
  };

  const handleRefreshClick = () => {
    fetchWrapper(listXmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => {
        setSelectedMedias(parsedData.Objects.Object);
      })
      .catch((error) => console.log("failed to parse xml", error));
  };

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
        onClick={handleRefreshClick}
        size="large"
        color="primary"
      >
        <Refresh />
      </IconButton>
    </ButtonGroup>
  );
}
