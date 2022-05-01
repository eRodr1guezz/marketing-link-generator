/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useEffect, useRef } from "react";
import { urlBuildReducer, initialState } from "../Reducers/urlBuildReducer";
import SimpleSnackbar from "./Snackbar";
import {
  TextField,
  FormControl,
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
} from "@mui/material";
import {
  ContentCopy,
  HelpOutlineOutlined,
  LinkRounded,
  AddCircleOutlineTwoTone,
} from "@mui/icons-material";
import { BitlyIcon } from "../bitlyIcon";
import useSnackbar from "../Hooks/useSnackbar";
import {
  socialIconHandler,
} from "../Utils";
import { APPEND_PARAM, SET_ERROR, SET_MESSAGE } from "../Reducers/actionTypes";
import { CampaignDrivers } from "./Specialized/CampaignDrivers";
import { BusinessUnitsSelect } from "./Specialized/BusinessUnitsSelect";
import { TherapeuticAreasSelect } from "./Specialized/TherapeuticAreasSelect"
import { UrlInput } from "./Specialized/UrlInput";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();
  const fieldRef = useRef(null);

  useEffect(() => {
    if (state.errors !== '') {
      openSnackBar(state.errors, "error");
    } else if (state.messages !== '') {
      openSnackBar(state.messages, "success");
    }
    return () => {
      dispatch({ type: SET_ERROR, value: "" });
      dispatch({ type: SET_MESSAGE, value: "" });
    };
  }, [state.errors, state.messages]);

  return (
    <>
      {isOpen ? (
        <SimpleSnackbar type={alertType} message={message} isOpen={true} />
      ) : null}
      <Paper elevation={5}>
        <Container fixed maxWidth='lg'>
          <Grid
            container
            direction='column'
            justifyContent='center'
            alignContent='center'
            alignItems='stretch'
            rowGap={1.75}
            sx={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8pt",
            }}>
            <Typography sx={{ fontWeight: 800 }} variant='h3'>
              Campaign URL Builder
            </Typography>

            {/* URL Input */}
            <UrlInput dispatchHandler={dispatch} formState={state} />

            {/* Campaign Name */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  name='campaign_name'
                  label='Campaign Name'
                  value={state.campaign_nameField || ""}
                  disabled={state.url === ''}
                  helperText='We suggest using the full WorkFront project title, ie. 333713.01_LBU_MEDSSummer_Hybrid_07-22_CME'
                  onChange={(e) => {
                    dispatch({
                      type: "setField",
                      fieldName: e.target.name,
                      value: e.currentTarget.value,
                    });
                    dispatch({
                      type: APPEND_PARAM,
                      paramType: "campaign",
                      param: e.currentTarget.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <BusinessUnitsSelect formState={state} dispatchHandler={dispatch} />

            <TherapeuticAreasSelect dispatchHandler={dispatch} formState={state} />

            {['Email'].map((comp, id) => (
              <CampaignDrivers
                type={'em'}
                key={id}
                dispatchHandler={dispatch}
                formState={state}
              />
            ))}

            <Box>
              <Button
                variant='text'
                size='medium'
                endIcon={
                  <AddCircleOutlineTwoTone fontSize='small' color='primary' />
                }>
                Add Additional Driver?
              </Button>
            </Box>

            <Divider>
              <Typography variant='button' fontWeight={"bold"}>
                Results
              </Typography>
            </Divider>

            {/* <UrlList businessUnitsFieldLength={state.generatedUrls.length}>
              {state.generatedUrls &&
                state.generatedUrls.map(({ href, id }) => (
                  <Grow
                    key={id}
                    in={state.currentSelectedDriver.length !== 0}
                    style={{ transformOrigin: "0 0 0" }}
                    {...(state.currentSelectedDriver.length !== 0
                      ? { timeout: 1000 }
                      : {})}>
                    <div name={id}>
                      <FormGroup sx={{ alignItems: "center" }} row>
                        <List>
                          <TextField
                            name='id'
                            onChange={(e) =>
                              e.currentTarget.value === ""
                                ? dispatch({
                                  type: "removeParam",
                                  paramType: e.target.name,
                                })
                                : null
                            }
                            onBlur={(e) =>
                              dispatch({
                                type: "updateSelectedUrl",
                                id,
                                value: e.currentTarget.value,
                                href,
                              })
                            }
                            label='id'
                          />
                          <TextField label='date' />
                          <TextField label='custom' />
                        </List>
                        <IconButton
                          onClick={(e) =>
                            dispatch({ type: "removeUrl", value: id })
                          }>
                          <RemoveCircle color='error' />
                        </IconButton>
                      </FormGroup>
                    </div>
                  </Grow>
                ))}
            </UrlList> */}

            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Typography>Create additional URL?</Typography>
              <IconButton
                onClick={() => dispatch({ type: "generateSingleUrl" })}>
                <AddCircle color='primary' />
              </IconButton>
            </Box> */}

            {state.urlsByDriverType && state.urlsByDriverType.length > 0
              ? state.urlsByDriverType.map((el) => {
                const elUrl = new URL(el.fullUrl);
                const socialCode = elUrl.searchParams.get("utm_driver_type");

                return (
                  <Box
                    key={elUrl}
                    component='form'
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      width: "100%",
                      border: "solid 1px lightblue",
                      borderRadius: "8pt",
                    }}>
                    <IconButton
                      disableRipple
                      sx={{ p: "8px" }}
                      aria-label='driver copy bar'>
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
                      orientation='vertical'
                    />
                    <IconButton
                      onClick={() =>
                        dispatch({
                          type: "copyUrl",
                          value: elUrl.href,
                        })
                      }
                      sx={{ p: "10px" }}
                      aria-label='copy url'>
                      <Tooltip title='Copy to clipboard'>
                        <ContentCopy />
                      </Tooltip>
                    </IconButton>
                    {state.bitlyUrlField > 0 ? (
                      <InputBase name='bitlyField' />
                    ) : null}
                  </Box>
                );
              })
              : null}


            <ButtonGroup fullWidth>
              <Button
                onClick={() => dispatch({ type: "renderUrls" })}
                variant='contained'>
                Generate URLs
              </Button>
              <Button
                color='secondary'
                onClick={() => dispatch({ type: "renderUrls" })}
                variant='contained'>
                Export URLs to CSV
              </Button>
            </ButtonGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}>
              <HelpOutlineOutlined fontSize='small' color='secondary' />
              <Link
                underline='always'
                variant='body2'
                style={{ textAlign: "right", textDecoration: "none" }}
                href='mailto:babruzese@medscapelive.com'>
                Issues with the URL builder? Get in touch!
              </Link>
            </div>
          </Grid>
        </Container>
      </Paper>
    </>
  );
}
