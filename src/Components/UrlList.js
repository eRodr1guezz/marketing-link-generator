import { RemoveCircle } from "@mui/icons-material";
import {
  Avatar,
  Box,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

export function UrlList({ children }) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </>
  );
}
