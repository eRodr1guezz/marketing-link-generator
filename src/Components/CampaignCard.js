import { LinkRounded, ContentCopy } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Box,
  Divider,
  Tooltip,
  IconButton,
  InputBase,
  Button,
} from "@mui/material";
import { SET_MESSAGE } from "../Reducers/actionTypes";
import { socialIconHandler } from "../Utils";
import { BitlyIcon } from "../bitlyIcon";

export function CampaignCard({
  dispatchHandler,
  id,
  urlList,
  title,
  subheader,
}) {
  return (
    <Card id={id}>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>
        {urlList.map((url) => {
          const elUrl = new URL(url.href);

          const socialCode = elUrl.searchParams.get("utm_driver_type"); //this will not work on bitly shortened links!

          return (
            <Box
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                border: "solid 1px lightblue",
                borderRadius: "8pt",
              }}
            >
              <IconButton
                disableRipple
                sx={{ p: "8px" }}
                aria-label="driver copy bar"
              >
                {!socialIconHandler(socialCode) ? (
                  <LinkRounded />
                ) : (
                  socialIconHandler(socialCode)
                )}
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, color: "#555" }}
                value={elUrl.href}
                inputProps={{
                  "aria-label": "copy url instance",
                  style: { fontSize: "smaller" },
                }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(elUrl.href);
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
                  <BitlyIcon htmlColor={"#ba68c8"} />
                </Tooltip>
              </IconButton>
            </Box>
          );
        })}
      </CardContent>
      <CardActionArea sx={{ padding: '1rem', display: 'flex', justifyContent: 'space-evenly' }}>
        <Button color="secondary" endIcon={<BitlyIcon />} variant="outlined">Shorten URLs</Button>
        <Button color="warning" variant="outlined">Export to CSV</Button>
      </CardActionArea>
    </Card>
  );
}
