import { atom } from "recoil";
import { ContentObject } from "./interfaces/xmlResponses";

const selectedMediasState = atom<ContentObject[]>({
  key: "selectedMediaState",
  default: [],
});

const currentMediaState = atom<ContentObject | null>({
  key: "currentMediaState",
  default: null,
});

export { selectedMediasState, currentMediaState };
