import { ButtonGroup, IconButton } from "@mui/material";

import { useRecoilValue } from "recoil";

import { currentContentObjectState } from "../recoil-states";
import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";

import {
  Add,
  Remove,
  Delete,
  RotateLeft,
  RotateRight,
} from "@mui/icons-material";

export default function MediaItemUtilButtons() {
  const currentContentObject = useRecoilValue(currentContentObjectState);

  const incXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      zoom: "placeholder",
    },
  });

  const decXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      zoom: "placeholder",
    },
  });

  const deleteXmlPayload = buildXml("Commands", {
    command: {
      "@type": "close",
      id: "placeholder",
    },
  });

  const rlXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      rot: "placeholder",
    },
  });

  const rrXmlPayload = buildXml("Commands", {
    command: {
      "@type": "change",
      rot: "placeholder",
    },
  });

  const handleIncreaseClick = () => {
    fetchWrapper(incXmlPayload);
  };
  const handleDecreaseClick = () => {
    fetchWrapper(decXmlPayload);
  };
  const handleDeleteClick = () => {
    fetchWrapper(deleteXmlPayload);
  };
  const handleRotateLeftClick = () => {
    fetchWrapper(rlXmlPayload);
  };
  const handleRotateRightClick = () => {
    fetchWrapper(rrXmlPayload);
  };

  if (!currentContentObject) {
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
