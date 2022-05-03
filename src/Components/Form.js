
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
// import { BitlyIcon } from "../bitlyIcon";
import useSnackbar from "../Hooks/useSnackbar";
import { socialIconHandler } from "../Utils";
import { SET_ERROR, SET_MESSAGE } from "../Reducers/actionTypes";
import { CampaignDrivers } from "./Specialized/CampaignDrivers";
import { BusinessUnitsSelect } from "./Specialized/BusinessUnitsSelect";
import { TherapeuticAreasSelect } from "./Specialized/TherapeuticAreasSelect";
import { UrlInput } from "./Specialized/UrlInput";
import { CampaignNameInput } from "./Specialized/CampaignNameInput";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [increment, setIncrement] = useState(0);
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
  }, [state.errors, state.messages, openSnackBar]);

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
            <CampaignDrivers formState={state} dispatchHandler={dispatch} />

            {state.generatedDrivers &&
              state.generatedDrivers.map((d) => {
                  return (
                    <CampaignDrivers
                      driverId={parseInt(Object.keys(d)[0])}
                      dispatchHandler={dispatch}
                      formState={state}
                    />
                  )
              })}

            <Box>
              <Button
                variant="text"
                size="medium"
                onClick={() => {
                  setIncrement(increment + 1);
                  let id = increment
                  dispatch({ type: "ADD_NEW_DRIVER", driverId: id });
                }}
                endIcon={
                  <AddCircleOutlineTwoTone fontSize="small" color="primary" />
                }
              >
                Add Additional Driver?
              </Button>
            </Box>

            <Divider>
              <Typography variant="button" fontWeight={"bold"}>
                Results
              </Typography>
            </Divider>

            {state.childUrls && state.childUrls.length > 0
              ? state.childUrls.map((el) => {
                  const elUrl = new URL(el.href);
                  const socialCode = elUrl.searchParams.get("utm_driver_type");

                  return (
                    <Grow
                      in={state.childUrls.length > 0}
                      style={{ transformOrigin: "0 0 0" }}
                      {...(state.childUrls.length > 0 ? { timeout: 500 } : {})}
                    >
                      <Box
                        key={elUrl}
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
                          inputProps={{ "aria-label": "copy url instance" }}
                        />
                        <Divider
                          sx={{ height: 28, m: 0.5 }}
                          orientation="vertical"
                        />
                        <IconButton
                          onClick={() =>
                            dispatch({
                              type: "copyUrl",
                              value: elUrl.href,
                            })
                          }
                          sx={{ p: "10px" }}
                          aria-label="copy url"
                        >
                          <Tooltip title="Copy to clipboard">
                            <ContentCopy />
                          </Tooltip>
                        </IconButton>
                        {state.bitlyUrlField > 0 ? (
                          <InputBase name="bitlyField" />
                        ) : null}
                      </Box>
                    </Grow>
                  );
                })
              : null}

            <ButtonGroup fullWidth>
              <Button
                onClick={() => dispatch({ type: "renderUrls" })}
                variant="contained"
              >
                Generate URLs
              </Button>
              <Button
                color="secondary"
                onClick={() => dispatch({ type: "renderUrls" })}
                variant="contained"
              >
                Export URLs to CSV
              </Button>
            </ButtonGroup>
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
