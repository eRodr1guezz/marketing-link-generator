import {
  ArrowDownwardSharp,
  ArrowRightAlt,
  RemoveCircleOutlined,
} from "@mui/icons-material";
import {
  CardContent,
  Box,
  Button,
  Typography,
  Card,
  IconButton,
  Divider,
} from "@mui/material";
import { BitlyIcon } from "../../bitlyIcon";
import { convertAndExportToCsv } from "../../Utils";
import { LinkResultListItem } from "../LinkResultListItem/LinkResultListItem";
import styles from "./campaignCard.module.css";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log(id)
    return () => {
      dispatchHandler({ type: "REMOVE_CAMPAIGN_CLEANUP", value: id, drivers: urlList.map(u => u.driver) })
    }
  }, [id, dispatchHandler, urlList])


  return (
    <Card key={id} sx={{ padding: ".75rem 1rem" }} raised id={id}>
      <CardContent className={styles.contentContainer}>
        <Box className={styles.header}>
          <Box>
            <Typography
              variant='h3'
              style={{
                fontSize: title.length < 10 ? 36 : "larger",
                fontWeight: "bolder",
              }}>
              {title}
            </Typography>
            <Typography variant='h6' color='saddlebrown' fontSize='smaller'>
              {subheader}
            </Typography>
            <Button
              color='warning'
              sx={{ flexGrow: 2, marginTop: ".75rem", marginBottom: ".5rem" }}
              endIcon={<ArrowRightAlt />}
              onClick={() =>
                convertAndExportToCsv(
                  formState.campaignList.filter((c) => c.id === id)
                )
              }
              size='small'
              variant='contained'>
              Export to CSV
            </Button>
          </Box>

          <IconButton
            onClick={() =>
              dispatchHandler({
                type: "DELETE_CAMPAIGN",
                value: id,
              })
            }
            sx={{ alignSelf: "flex-start" }}>
            <RemoveCircleOutlined className={styles.deleteIcon} color='error' />
          </IconButton>
        </Box>
        {formState[id + "shortenedUrls"] &&
          formState[id + "shortenedUrls"].length > 0
          ? formState[id + "shortenedUrls"].map(({ oldUrl, shortUrl }) => {
            const old = new URL(oldUrl);
            const socialCode = old.searchParams.get("utm_driver_type");
            return (
              <>
                <Box
                  key={oldUrl}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignSelf: "flex-start",
                      fontWeight: "bolder",
                      color: "purple",
                      paddingBottom: "4px",
                      paddingLeft: "4px",
                    }}>
                    {socialCode}
                    <Divider />
                  </Box>
                  <LinkResultListItem
                    dispatchHandler={dispatchHandler}
                    fullWidth
                    href={old}
                    shortened={true}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    ...Shortened to
                    <ArrowDownwardSharp
                      sx={{ paddingTop: '4px' }}
                      fontSize={"small"}
                    />
                  </Box>
                  <LinkResultListItem
                    href={shortUrl}
                    dispatchHandler={dispatchHandler}
                    social={socialCode ? socialCode : null}
                    shortened={true}
                  />
                  <Divider />
                </Box>
              </>
            );
          })
          : urlList.map((url) => {
            const u = new URL(url);
            const socialCode = u.searchParams.get("utm_driver_type");
            return (
              <LinkResultListItem
                backgroundColor={"lightgrey"}
                href={u.href}
                social={socialCode}
                dispatchHandler={dispatchHandler}
              />
            );
          })}
        <Button
          fullWidth
          color='secondary'
          endIcon={<BitlyIcon />}
          variant='contained'
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
      </CardContent>
    </Card>
  );
}
