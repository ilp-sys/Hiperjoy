import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Box, Skeleton } from "@mui/material";
import { styled } from "@mui/system";

import { selectedMediasState } from "../recoil-states";
import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";
import { Thumbnails } from "../interfaces/utilTypes";

const CustomPagination = () => {
  const selectedMedias = useRecoilValue(selectedMediasState);
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState<Thumbnails>({});

  useEffect(() => {
    const fetchThumbnails = async () => {
      setLoading(true);
      try {
        const thumbnamePromises = selectedMedias.map(async (media) => {
          const previewXmlPayload = buildXml("Commands", {
            command: {
              "@type": "preview",
              name: `${media.name}`,
            },
          });
          const responseText = await fetchWrapper(previewXmlPayload);
          const imageBlob = new Blob([responseText], { type: "image/png" });
          const imageUrl = URL.createObjectURL(imageBlob);
          return { name: media.name, url: imageUrl };
        });

        const results = await Promise.all(thumbnamePromises);
        const thumbnailsDict: Thumbnails = results.reduce<Thumbnails>(
          (acc, { name, url }) => {
            acc[name] = url;
            return acc;
          },
          {}
        );
        setThumbnails(thumbnailsDict);
        console.log(thumbnails);
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

  if (loading) {
    return <Skeleton variant="rounded" />;
  }

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {selectedMedias.map((media) => (
        <Box key={media.name} p={1} m={1}>
          {thumbnails[media.name] ? (
            <img
              src={thumbnails[media.name]}
              alt={`Thumbnail for ${media.name}`}
              style={{ maxWidth: "150px", maxHeight: "150px" }}
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
