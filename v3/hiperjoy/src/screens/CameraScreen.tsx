import deviceImage from "../assets/leap-motion-controller-2.png";
import { Badge, Container, Divider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const imgStyle = {
  width: "40vw",
  height: "auto",
  transition: "transform 0.3s ease-in-out",
};

const imgHoverStyle = {
  transform: "scale(1.5)",
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function () {
  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        mt="5vh"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        연결된 기기
      </Typography>
      <Divider />
      <Stack direction="column" alignItems="center" justifyContent="center">
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          variant="dot"
        >
          <img
            src={deviceImage}
            alt="Device"
            style={imgStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = imgHoverStyle.transform)
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </StyledBadge>
        <Typography variant="h6">Leap Motion Controller 2</Typography>
        <Typography color="text.secondary" variant="body2">
          Pinstriped cornflower blue cotton blouse takes you on a walk to the
          park or just down the hall.
        </Typography>
      </Stack>
    </Container>
  );
}
