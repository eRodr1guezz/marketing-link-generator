import { CardContent, CardHeader, Box, Button } from "@mui/material";
import { BitlyIcon } from "../bitlyIcon";
import { convertAndExportToCsv } from "../Utils";
import { LinkResultListItem } from "./LinkResultListItem";

const devUrl = "http://localhost:9999/.netlify/functions/url-shorten";
const prodUrl =
  "https://effulgent-cocada-e3d151.netlify.app/.netlify/functions/url-shorten";

export function CampaignCard({
  formState,
  dispatchHandler,
  id,
  urlList,
  title,
  subheader,
}) {
  return (
    <Box
      sx={{
        padding: "0rem 1.5rem",
        border: "1px dotted #999",
        marginBottom: "1rem",
      }}
      id={id}>
      <CardHeader
        titleTypographyProps={{ fontWeight: "bolder", fontSize: "24pt" }}
        subheaderTypographyProps={{ sx: { content: '"HUH: "' } }}
        title={title}
        subheader={subheader}
      />
      <CardContent>
        <Box sx={{ display: "flex", gap: ".75rem", flexDirection: "column" }}>
          {formState[id + "shortenedUrls"] &&
            formState[id + "shortenedUrls"].length > 0
            ? formState[id + "shortenedUrls"].map(({ oldUrl, shortUrl }) => {
              const old = new URL(oldUrl);
              // const short = new URL(shortUrl)
              const socialCode = old.searchParams.get("utm_driver_type");
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".25rem",
                  }}>
                  <LinkResultListItem href={old} shortened={true} />
                  <div style={{ width: "75%" }}>
                    <LinkResultListItem
                      href={shortUrl}
                      dispatchHandler={dispatchHandler}
                      social={socialCode ? socialCode : null}
                      shortened={true}
                    />
                  </div>
                </Box>
              );
            })
            : urlList.map((url) => {
              const u = new URL(url);
              const socialCode = u.searchParams.get("utm_driver_type");
              return (
                <LinkResultListItem
                  href={u.href}
                  social={socialCode}
                  dispatchHandler={dispatchHandler}
                />
              );
            })}
        </Box>
      </CardContent>
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-evenly",
        }}>
        <Button
          color='secondary'
          endIcon={<BitlyIcon />}
          variant='outlined'
          onClick={async () => {
            let data = await fetch(
              process.env.NODE_ENV === "development" ? devUrl : prodUrl,
              {
                method: "POST",
                body: JSON.stringify(urlList.map((u) => u.href)),
              }
            );

            let response = await data.json();

            dispatchHandler({
              type: "SHORTEN_URLS",
              value: response,
              campId: id,
            });
          }}>
          Shorten ALL Campaign URLs
        </Button>
        <Button
          onClick={() => convertAndExportToCsv(formState.campaignList.filter(c => c.id === id))}
          color='warning'
          variant='outlined'>
          Export to CSV
        </Button>
      </Box>
    </Box>
  );
}
