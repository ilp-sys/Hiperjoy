import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import FolderIcon from "@mui/icons-material/Folder";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("feeds");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Feeds"
        value="feeds"
        icon={<MonitorRoundedIcon />}
      />
      <BottomNavigationAction
        label="Wallinfo"
        value="wallinfo"
        icon={<InfoRoundedIcon />}
      />
      <BottomNavigationAction
        label="Camera"
        value="camera"
        icon={<VideocamRoundedIcon />}
      />
      <BottomNavigationAction
        label="Folder"
        value="folder"
        icon={<FolderIcon />}
      />
    </BottomNavigation>
  );
}
