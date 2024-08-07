import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Box, Skeleton } from "@mui/material";
import { styled } from "@mui/system";

import { selectedMediasState } from "../recoil-states";
import { fetchWrapper } from "../utils/fetchers";
import { buildXml } from "../utils/buildXml";

const Thumbnail = styled(Box)(({ theme, selected }) => ({
  width: 50,
  height: 50,
  backgroundColor: selected ? theme.palette.primary.main : "transparent",
  border: selected ? "2px solid white" : "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: 4,
  "& img": {
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

const CustomPagination = () => {
  const selectedMedias = useRecoilValue(selectedMediasState);
  const [thumbnails, setThumbnails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

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
          fetchWrapper(previewXmlPayload).then((response) =>
            console.log(response)
          );
          //TODO: parse the response
          return { id: media.name, src: URL.createObjectURL(blob) };
        });
        const thumbnailResults = await Promise.all(thumbnailPromises);
        const thumbnailMap = thumbnailResults.reduce((acc, thumbnail) => {
          acc[thumbnail.name] = thumbnail.src;
          return acc;
        }, {});
        setThumbnails(thumbnailMap);
      } catch (error) {
        console.error("Error fetching thumbnails:", error);
      }
      setLoading(false);
    };

    fetchThumbnails();
  }, [selectedMedias]);

  if (loading) {
    return <Skeleton variant="rounded" />;
  }

  return (
    <Box display="flex" alignItems="center">
      {selectedMedias.map((media, index) => (
        <Thumbnail
          key={media.name}
          selected={currentPage === index + 1}
          onClick={() => setCurrentPage(index + 1)}
        >
          {thumbnails[media.name] ? (
            <img
              src={thumbnails[media.name]}
              alt={`Thumbnail for ${media.name}`}
            />
          ) : (
            <p>No Image</p>
          )}
        </Thumbnail>
      ))}
    </Box>
  );
};

export default CustomPagination;
