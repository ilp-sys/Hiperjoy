import { useState } from "react";
import { Drawer, Divider } from "@mui/material";

export default function MediaDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      drawer conf
      <Divider />
    </Drawer>
  );
}
