import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { buildXml } from "../utils/buildXml";
import { fetchWrapper } from "../utils/fetchers";
import { parseStringPromise } from "xml2js";

import { selectedMediasState } from "../recoil-states";

export function useRefreshSelectedMedias() {
  const setSelectedMedias = useSetRecoilState(selectedMediasState);

  const refreshSelectedMedias = useCallback(() => {
    const listXmlPayload = buildXml("Commands", {
      action: {
        "@type": "list",
        filter: "open",
      },
    });

    fetchWrapper(listXmlPayload)
      .then((response) => parseStringPromise(response))
      .then((parsedData) => {
        const mediaObjects = parsedData.Objects.Object;
        setSelectedMedias(mediaObjects);
      })
      .catch((error) =>
        console.error("Failed to refresh selected medias", error)
      );
  }, [setSelectedMedias]);

  return refreshSelectedMedias;
}
