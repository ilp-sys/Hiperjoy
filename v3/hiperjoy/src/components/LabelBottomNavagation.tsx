import * as React from "react";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("feeds");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const hoverStyles = {
    "&:hover": {
      color: "primary.main",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Feeds"
          value="feeds"
          icon={<MonitorRoundedIcon />}
          sx={hoverStyles}
        />
        <BottomNavigationAction
          label="Wallinfo"
          value="wallinfo"
          icon={<InfoRoundedIcon />}
          sx={hoverStyles}
        />
        <BottomNavigationAction
          label="Camera"
          value="camera"
          icon={<VideocamRoundedIcon />}
          sx={hoverStyles}
        />
        <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<FolderIcon />}
          sx={hoverStyles}
        />
      </BottomNavigation>
    </Paper>
  );
}
