import { ButtonGroup, IconButton } from "@mui/material";
import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";
import { useCurrentInstance } from "../utils/useCurrentInstance";
import { useRefreshSelectedMedias } from "../utils/useRefreshSelectedMedias";
import { useState } from "react";

import {
  Add,
  Remove,
  Delete,
  RotateLeft,
  RotateRight,
} from "@mui/icons-material";

export default function MediaItemUtilButtons() {
  const currentInstance = useCurrentInstance();
  const refreshSelectedMedias = useRefreshSelectedMedias();
  const [zoomState, setZoomState] = useState(1);

  const handleZoomChange = (zoomFactor: number) => {
    if (!currentInstance) return;
    setZoomState(zoomState + zoomFactor);
    const zoomXmlPayload = buildXml("Commands", {
      command: {
        "@type": "change",
        id: currentInstance.id,
        zoom: zoomState,
      },
    });
    fetchWrapper(zoomXmlPayload).catch((error) => console.error(error));
    refreshSelectedMedias();
  };

  const handleRotationChange = (rotationChange: number) => {
    if (!currentInstance) return;
    const newRot = currentInstance.rotation + rotationChange;
    const rotationXmlPayload = buildXml("Commands", {
      command: {
        "@type": "change",
        id: currentInstance.id,
        rot: newRot,
      },
    });
    console.log(rotationXmlPayload);
    fetchWrapper(rotationXmlPayload).catch((error) => console.error(error));
    refreshSelectedMedias();
  };

  const handleIncreaseClick = () => handleZoomChange(0.05);
  const handleDecreaseClick = () => handleZoomChange(-0.05);
  const handleRotateLeftClick = () => handleRotationChange(-45);
  const handleRotateRightClick = () => handleRotationChange(45);
  const handleDeleteClick = () => {
    if (!currentInstance) return;

    const deleteXmlPayload = buildXml("Commands", {
      command: {
        "@type": "close",
        id: currentInstance.id,
      },
    });

    fetchWrapper(deleteXmlPayload).catch((error) => console.error(error));
    refreshSelectedMedias();
  };

  if (!currentInstance) {
    return <></>;
  }

  return (
    <ButtonGroup>
      <IconButton aria-label="increase" onClick={handleIncreaseClick}>
        <Add />
      </IconButton>
      <IconButton aria-label="decrease" onClick={handleDecreaseClick}>
        <Remove />
      </IconButton>
      <IconButton aria-label="delete" onClick={handleDeleteClick}>
        <Delete />
      </IconButton>
      <IconButton aria-label="rotate-left" onClick={handleRotateLeftClick}>
        <RotateLeft />
      </IconButton>
      <IconButton aria-label="rotate-right" onClick={handleRotateRightClick}>
        <RotateRight />
      </IconButton>
    </ButtonGroup>
  );
}
