import {
  Box,
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
