import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Box, Skeleton } from "@mui/material";

import { selectedMediasState } from "../recoil-states";
import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";
import { Thumbnails } from "../interfaces/utilTypes";
import {
  currentContentObjectState,
  currentInstanceIDState,
} from "../recoil-states";
import { useSetRecoilState } from "recoil";
import { ContentObject } from "../interfaces/xmlResponses";

const CustomPagination = () => {
  const selectedMedias = useRecoilValue(selectedMediasState);
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState<Thumbnails>({});

  const setCurrentContentObject = useSetRecoilState(currentContentObjectState);
  const setCurrentInstanceID = useSetRecoilState(currentInstanceIDState);

  useEffect(() => {
    const fetchThumbnails = async () => {
      setLoading(true);
      try {
        const thumbnailPromises = selectedMedias.map(async (media) => {
          const previewXmlPayload = buildXml("Commands", {
            command: {
              "@type": "preview",
              name: `${media.name}`,
            },
          });

          const response = await fetchWrapper(previewXmlPayload);

          if (response instanceof Blob) {
            const imageUrl = URL.createObjectURL(response);
            return { name: media.name, url: imageUrl };
          } else {
            console.error("Unexpected response type:", typeof response);
            throw new Error("Unexpected response type");
          }
        });

        const results = await Promise.all(thumbnailPromises);
        const thumbnailsDict: Thumbnails = results.reduce<Thumbnails>(
          (acc, { name, url }) => {
            acc[name] = url;
            return acc;
          },
          {}
        );
        setThumbnails(thumbnailsDict);
      } catch (error) {
        console.error("Error fetching thumbnails:", error);
      }
      setLoading(false);
    };

    fetchThumbnails();
    return () => {
      Object.values(thumbnails).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedMedias]);

  const handleImageClick = (media: ContentObject) => {
    setCurrentContentObject(media);
    setCurrentInstanceID(media.Instance[0].id);
  };

  if (loading) {
    return <Skeleton variant="rounded" />;
  }

  //TODO: iter by instance, not media
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {selectedMedias.map((media) => (
        <Box key={media.name} p={1} m={1}>
          {thumbnails[media.name] ? (
            <img
              src={thumbnails[media.name]}
              alt={`Thumbnail for ${media.name}`}
              style={{ maxWidth: "150px", maxHeight: "150px" }}
              onClick={() => handleImageClick(media)}
            />
          ) : (
            <p>No Image</p>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CustomPagination;
