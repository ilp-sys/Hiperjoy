import React, { useState, useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Container, Typography } from "@mui/material";
import { selectedMediasState } from "../recoil-states";
import { MediaItem } from "./MediaItem";
import { ContentObject, Instance } from "../interfaces/xmlResponses";
import { mockMedias } from "../test/mockMedias";

const MediaPanel: React.FC = () => {
  const selectedMedias = useRecoilValue(selectedMediasState);
  const setSelectedMedias = useSetRecoilState(selectedMediasState);
  const [hoveredId, setHoveredId] = useState<string>("");

  const onDrag = useCallback(
    (
      event: React.DragEvent<HTMLDivElement>,
      mediaUuid: string,
      instanceId: string
    ) => {
      const newX = event.clientX;
      const newY = event.clientY;

      setSelectedMedias((medias) =>
        medias.map((media) => {
          if (media.uuid !== mediaUuid) return media;
          return {
            ...media,
            Instance: media.Instance.map((instance) => {
              if (instance.id !== instanceId) return instance;
              return {
                ...instance,
                position: `${newX},${newY}`,
              };
            }),
          };
        })
      );
    },
    [setSelectedMedias]
  );

  const onScale = useCallback(
    (deltaScale: number, mediaUuid: string, instanceId: string) => {
      setSelectedMedias((medias) =>
        medias.map((media) => {
          if (media.uuid !== mediaUuid) return media;
          return {
            ...media,
            Instance: media.Instance.map((instance) => {
              if (instance.id !== instanceId) return instance;
              return {
                ...instance,
                size: (parseFloat(instance.size) * (1 + deltaScale)).toString(),
              };
            }),
          };
        })
      );
    },
    [setSelectedMedias]
  );

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {selectedMedias.length === 0 ? (
        <Typography color="text.secondary" mt="20vh">
          선택된 미디어가 없습니다.
        </Typography>
      ) : (
        selectedMedias.flatMap((media: ContentObject) =>
          media.Instance.map((instance: Instance) => (
            <MediaItem
              key={instance.id}
              media={media}
              instance={instance}
              position={{
                x: parseFloat(instance.position.split(",")[0]),
                y: parseFloat(instance.position.split(",")[1]),
              }}
              scale={parseFloat(instance.size)}
              onDragStart={(e) => onDrag(e, media.uuid!, instance.id)}
              onDrag={(e) => onDrag(e, media.uuid!, instance.id)}
              onDragEnd={(e) => onDrag(e, media.uuid!, instance.id)}
              onWheel={(e) =>
                onScale(e.deltaY * -0.01, media.uuid!, instance.id)
              }
              isHovered={hoveredId === instance.id}
              onMouseEnter={() => setHoveredId(instance.id)}
              onMouseLeave={() => setHoveredId("")}
            />
          ))
        )
      )}
    </Container>
  );
};

export default MediaPanel;
