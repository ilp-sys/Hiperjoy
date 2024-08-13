import { atom } from "recoil";
import { ContentObject } from "./interfaces/xmlResponses";
import { Thumbnails } from "./interfaces/utilTypes";

const selectedMediasState = atom<ContentObject[]>({
  key: "selectedMediaState",
  default: [],
});

const currentContentObjectState = atom<ContentObject | null>({
  key: "currentContentObjectState",
  default: null,
});

const currentInstanceIDState = atom<string>({
  key: "currnetInstanceIDState",
  default: "",
});

const thumbnailsState = atom<Thumbnails>({
  key: "thumbnailsState",
  default: {},
});

export {
  selectedMediasState,
  currentContentObjectState,
  currentInstanceIDState,
  thumbnailsState,
};
