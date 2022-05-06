import csvDownload from "json-to-csv-export";
import { useReducer, useEffect, useRef, useState } from "react";
import { urlBuildReducer, initialState } from "../Reducers/urlBuildReducer";
import SimpleSnackbar from "./Snackbar";
import {
  Link,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  InputBase,
  Divider,
  ButtonGroup,
  Grow,
} from "@mui/material";
import {
  ContentCopy,
  HelpOutlineOutlined,
  LinkRounded,
  AddCircleOutlineTwoTone,
} from "@mui/icons-material";
import useSnackbar from "../Hooks/useSnackbar";
import { shortenURL, socialIconHandler } from "../Utils";
import { SET_ERROR, SET_MESSAGE } from "../Reducers/actionTypes";
import { CampaignDrivers } from "./Specialized/CampaignDrivers";
import { BusinessUnitsSelect } from "./Specialized/BusinessUnitsSelect";
import { TherapeuticAreasSelect } from "./Specialized/TherapeuticAreasSelect";
import { UrlInput } from "./Specialized/UrlInput";
import { CampaignNameInput } from "./Specialized/CampaignNameInput";
import { BitlyIcon } from "../bitlyIcon";
import BitlyTokenModal from "./Specialized/BitlyTokenModal";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [increment, setIncrement] = useState(1);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();
  const fieldRef = useRef(null);

  useEffect(() => {
    if (state.errors !== "") {
      openSnackBar(state.errors, "error");
    } else if (state.messages !== "") {
      openSnackBar(state.messages, "success");
    }
    return () => {
      dispatch({ type: SET_ERROR, value: "" });
      dispatch({ type: SET_MESSAGE, value: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.errors, state.messages]);

  return (
    <>
      {isOpen ? (
        <SimpleSnackbar type={alertType} message={message} isOpen={true} />
      ) : null}
      <Paper elevation={5}>
        <Container fixed maxWidth="lg">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignContent="center"
            alignItems="stretch"
            rowGap={1.75}
            sx={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8pt",
            }}
          >
            <Typography sx={{ fontWeight: 800 }} variant="h3">
              Campaign URL Builder
            </Typography>

            <UrlInput dispatchHandler={dispatch} formState={state} />
            <CampaignNameInput formState={state} dispatchHandler={dispatch} />
            <BusinessUnitsSelect formState={state} dispatchHandler={dispatch} />
            <TherapeuticAreasSelect
              formState={state}
              dispatchHandler={dispatch}
            />
            <CampaignDrivers
              driverId={10000}
              formState={state}
              dispatchHandler={dispatch}
            />

            {state.generatedDrivers &&
              state.generatedDrivers.map((d) => {
                return (
                  <CampaignDrivers
                    driverId={parseInt(Object.keys(d)[0])}
                    dispatchHandler={dispatch}
                    formState={state}
                  />
                );
              })}

            <Box>
              <Button
                variant="text"
                size="medium"
                onClick={() => {
                  setIncrement(increment + 1);
                  let id = increment;
                  dispatch({ type: "ADD_NEW_DRIVER", driverId: id });
                }}
                endIcon={
                  <AddCircleOutlineTwoTone fontSize="small" color="primary" />
                }
              >
                Add Additional Driver?
              </Button>
            </Box>

            <Grid item>
              <Box sx={{ paddingTop: "1rem" }}>
                <ButtonGroup fullWidth>
                  <Button
                    disabled={state.disabledFields}
                    onClick={() => dispatch({ type: "GENERATE_URL_CAMPAIGN" })}
                    variant="contained"
                  >
                    Generate URL Campaign
                  </Button>
                  <Button
                    disabled={state.urlCollection.length === 0}
                    color="secondary"
                    onClick={() =>
                      csvDownload(
                        JSON.parse(
                          JSON.stringify(state.urlCollection.map((u) => u.href))
                        ),
                        "urls.csv"
                      )
                    }
                    variant="contained"
                  >
                    Export URLs to CSV
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>

            <Divider>
              <Typography variant="button" fontWeight={"bold"}>
                Results
              </Typography>
            </Divider>

            <Box
              sx={{
                height: state.urlCollection.length > 1 ? "160px" : 'auto',
                overflow: "auto",
                opacity: state.urlCollection.length === 0 && 0.75,
                backgroundColor: state.urlCollection.length === 0 && 'lightgrey'
              }}>
              <span style={{ textAlign: 'right', color: '#777' }}>{state.campaignLastGenerated && <Typography variant="body2">Last Campaign generated at: {state.campaignLastGenerated}</Typography>}</span>
              {state.urlCollection && state.urlCollection.length > 0
                ? state.urlCollection.map((el) => {
                  const elUrl = new URL(el);

                  const socialCode =
                    elUrl.searchParams.get("utm_driver_type"); //this will not work on bitly shortened links!

                  return (
                    <Grow
                      key={elUrl}
                      in={state.urlCollection.length > 0}
                      style={{ transformOrigin: "0 0 0" }}
                      {...(state.urlCollection.length > 0
                        ? { timeout: 500 }
                        : {})}
                    >
                      <Box sx={{ padding: ".15rem 1rem" }}>
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
                            ref={fieldRef}
                            sx={{ ml: 1, flex: 1, color: "#555" }}
                            value={elUrl.href}
                            inputProps={{
                              "aria-label": "copy url instance",
                              style: { fontSize: "smaller" },
                            }}
                          />
                          <Divider
                            sx={{ height: 28, m: 0.5 }}
                            orientation="vertical"
                          />
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(elUrl.href);
                              dispatch({ type: SET_MESSAGE, value: 'URL successfully copied to your clipboard!' })
                            }}
                            sx={{ p: "10px" }}
                            aria-label="copy url"
                          >
                            <Tooltip title="Copy to clipboard">
                              <ContentCopy />
                            </Tooltip>
                          </IconButton>
                          <Divider
                            sx={{ height: 28, m: 0.5 }}
                            orientation="vertical"
                          />
                          <IconButton
                            onClick={() => {
                              dispatch({ type: SET_MESSAGE, value: 'URL successfully shortened with Bit.ly!' })
                            }}
                            sx={{ p: "10px" }}
                            aria-label="copy url"
                          >
                            <Tooltip title="Shorten URL">
                              <BitlyIcon htmlColor={'#ba68c8'} />
                            </Tooltip>
                          </IconButton>
                        </Box>
                      </Box>
                    </Grow>
                  );
                })
                : null}
            </Box>
            {/* Bitly shortening */}

            <Grid item>
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <BitlyTokenModal dispatchHandler={dispatch} />
                <Button
                  disabled={state.bitlyAccessTokenField === ""}
                  variant="outlined"
                  color="warning"
                  onClick={async () => {
                    let data = await shortenURL(
                      state.urlCollection.map(u => u.href),
                      state.bitlyAccessTokenField
                    )

                    dispatch({
                      type: "SHORTEN_URLS",
                      value: data
                    })
                  }}
                  endIcon={
                    <BitlyIcon htmlColor="#e4def" sx={{ paddingTop: "2px" }} />
                  }
                >
                  Shorten ALL URLs
                </Button>
              </Box>
            </Grid>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <HelpOutlineOutlined fontSize="small" color="secondary" />
              <Link
                underline="always"
                variant="body2"
                style={{ textAlign: "right", textDecoration: "none" }}
                href="mailto:babruzese@medscapelive.com"
              >
                Issues with the URL builder? Get in touch!
              </Link>
            </div>
          </Grid>
        </Container>
      </Paper>
    </>
  );
}
