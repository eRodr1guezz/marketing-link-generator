import { Box, IconButton, InputBase, Divider, Tooltip } from "@mui/material";
import { socialIconHandler } from "../Utils";
import { LinkRounded, ContentCopy } from "@mui/icons-material";
import { BitlyIcon } from "../bitlyIcon";
import { SET_MESSAGE } from "../Reducers/actionTypes";

export function LinkResultListItem({ formState, dispatchHandler, href, social, shortened }) {
  return (
    <Box
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
        border: "solid 1px black",
        borderRadius: "8pt",
      }}
    >
      <IconButton
        disableRipple
        sx={{ p: "8px" }}
        aria-label="driver copy bar"
      >
        {!socialIconHandler(social) ? (
          <LinkRounded />
        ) : (
          socialIconHandler(social)
        )}
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, color: "#555" }}
        value={href}
        inputProps={{
          "aria-label": "copy url instance",
          style: { fontSize: "smaller" },
        }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(href);
          dispatchHandler({
            type: SET_MESSAGE,
            value: "URL successfully copied to your clipboard!",
          });
        }}
        sx={{ p: "10px" }}
        aria-label="copy url"
      >
        <Tooltip title="Copy to clipboard">
          <ContentCopy />
        </Tooltip>
      </IconButton>
      {!shortened &&
        <>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            onClick={() => {
              dispatchHandler({
                type: SET_MESSAGE,
                value: "URL successfully shortened with Bit.ly!",
              });
            }}
            sx={{ p: "10px" }}
            aria-label="copy url"
          >
            <Tooltip title="Shorten URL">
              <BitlyIcon htmlColor={"black"} />
            </Tooltip>
          </IconButton>
        </>
      }
    </Box>
  )
}