import {
  Box,
  IconButton,
  InputBase,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { socialIconHandler } from "../../Utils";
import { ContentCopy } from "@mui/icons-material";
// import { BitlyIcon } from "../../bitlyIcon";
import { SET_MESSAGE } from "../../Reducers/actionTypes";
import styles from "./linkResultListItem.module.css";

export function LinkResultListItem({
  dispatchHandler,
  href,
  social,
  shortened,
}) {
  return (
    <Box component='form' className={styles.container}>
      <IconButton disableRipple sx={{ p: "8px" }} aria-label='driver copy bar'>
        {!socialIconHandler(social) ? (
          !shortened ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "lavender",
                padding: "4px 8px",
              }}>
              <Typography
                sx={{
                  color: "purple",
                  fontSize: "small",
                  fontWeight: "bolder",
                }}>
                {social}
              </Typography>
            </Box>
          ) : null
        ) : (
          socialIconHandler(social)
        )}
      </IconButton>
      <InputBase
        sx={{ flex: 1, color: "black" }}
        value={href}
        inputProps={{
          "aria-label": "copy url instance",
          style: { fontSize: "smaller" },
        }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(href);
          dispatchHandler({
            type: SET_MESSAGE,
            value: "URL successfully copied to your clipboard!",
          });
        }}
        aria-label='copy url'>
        <Tooltip title='Copy to clipboard'>
          <ContentCopy htmlColor='black' />
        </Tooltip>
      </IconButton>
    </Box>
  );
}
