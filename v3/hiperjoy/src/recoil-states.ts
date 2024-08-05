import { atom } from "recoil";
import { ContentObject } from "./interfaces/xmlResponses";

const selectedMediasState = atom<ContentObject[]>({
  key: "selectedMediaState",
  default: [],
});

export { selectedMediasState };
