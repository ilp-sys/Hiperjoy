import { atom } from "recoil";
import { ContentObject } from "./interfaces/xmlResponses";

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

export {
  selectedMediasState,
  currentContentObjectState,
  currentInstanceIDState,
};
