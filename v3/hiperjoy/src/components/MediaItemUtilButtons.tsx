import { ButtonGroup, IconButton } from "@mui/material";

import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";
import { useCurrentInstance } from "../utils/useCurrentInstance";

import {
  Add,
  Remove,
  Delete,
  RotateLeft,
  RotateRight,
} from "@mui/icons-material";

export default function MediaItemUtilButtons() {
  const currentInstance = useCurrentInstance();

  const incXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      id: currentInstance?.id,
      zoom: "1.1",
    },
  });

  const decXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      id: currentInstance?.id,
      zoom: "-1.1",
    },
  });

  const deleteXmlPayload = buildXml("Commands", {
    command: {
      "@type": "close",
      id: currentInstance?.id,
    },
  });

  const rlXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      id: currentInstance?.id,
      rot: "-45",
    },
  });

  const rrXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      id: currentInstance?.id,
      rot: "45",
    },
  });

  const handleIncreaseClick = () => {
    fetchWrapper(incXmlPayload).catch((error) => console.error(error));
  };
  const handleDecreaseClick = () => {
    fetchWrapper(decXmlPayload).catch((error) => console.error(error));
  };
  const handleDeleteClick = () => {
    fetchWrapper(deleteXmlPayload).catch((error) => console.error(error));
  };
  const handleRotateLeftClick = () => {
    fetchWrapper(rlXmlPayload).catch((error) => console.error(error));
  };
  const handleRotateRightClick = () => {
    fetchWrapper(rrXmlPayload).catch((error) => console.error(error));
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
