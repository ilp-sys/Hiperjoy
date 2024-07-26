import deviceImage from "../assets/leap-motion-controller-2.png";
import { Divider, Stack, Typography } from "@mui/material";

const imgStyle = {
  width: "40vw",
  height: "auto",
  transition: "transform 0.3s ease-in-out",
};

const imgHoverStyle = {
  transform: "scale(1.5)",
};

export default function () {
  return (
    <Stack direction="row">
      <Typography variant="h4">연결된 기기</Typography>
      <img
        src={deviceImage}
        alt="Device"
        style={imgStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = imgHoverStyle.transform)
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      <Divider />
      <div>optional camera logs</div>
    </Stack>
  );
}
