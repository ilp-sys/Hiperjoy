import { useRecoilValue } from "recoil";
import {
  currentContentObjectState,
  currentInstanceIDState,
} from "../recoil-states";
import { Instance } from "../interfaces/xmlResponses";

export function useCurrentInstance(): Instance | undefined {
  const currentContentObject = useRecoilValue(currentContentObjectState);
  const currentInstanceID = useRecoilValue(currentInstanceIDState);

  if (!currentContentObject || !currentInstanceID) return undefined;

  return currentContentObject.Instance.find(
    (instance) => instance.id === currentInstanceID
  );
}
