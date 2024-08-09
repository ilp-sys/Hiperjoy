import { ListItem } from "@mui/material";
import { styled } from "@mui/system";

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: "1px solid #ddd",
  borderRadius: "4px",
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
}));
