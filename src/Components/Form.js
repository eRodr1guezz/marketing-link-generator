/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useEffect, useRef } from "react";
import { urlBuildReducer, initialState } from "../Reducers/urlBuildReducer";
import SimpleSnackbar from "./Snackbar";
import {
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Link,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  OutlinedInput,
  Chip,
  Tooltip,
  IconButton,
  InputBase,
  Divider,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CheckCircle,
  ContentCopy,
  HelpOutlineOutlined,
  LinkRounded,
} from "@mui/icons-material";
import useSnackbar from "../Hooks/useSnackbar";
import { socialIconHandler, subcatFilter, validateUrl } from "../Utils";
import { businessUnits, businessUnitSubCategories } from "../internal";

const APPEND_PARAM = "appendParam";

export default function Form() {
  const theme = useTheme();
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();
  const fieldRef = useRef(null);

  const label = { inputProps: { "aria-label": "Therapeutic Areas?" } };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, driverName, theme) {
    return {
      fontWeight:
        driverName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  async function shortenURL(url, access_token) {
    //should accept a single (or list) of urls to shorten and return a single (or list of) URL instance(s).
    const bitlyURL = `https://api-ssl.bitly.com/v4/shorten`;
    await fetch(bitlyURL, {
      method: "POST",
      body: JSON.stringify({
        // group_guid: "o_5kc1f828jm",
        long_url: url,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "FORBIDDEN") {
          dispatch({
            type: "error",
            value: "Invalid access token. Please check and try again.",
          });
        } else {
          dispatch({ type: "setBitlyUrlList", value: data.link });
          // return data.link;
        }
      });
  }

  useEffect(() => {
    if (state.errors.length > 0) {
      openSnackBar(state.errors, "error");
    } else if (state.messages.length > 0) {
      openSnackBar(state.messages, "success");
    }
    return () => {
      dispatch({ type: "error", value: "" });
      dispatch({ type: "message", value: "" });
    };
  }, [state.errors, state.messages]);

  useEffect(() => {
    state.currentSelectedDriver.length > 0 && //if there is a driver currently selected...
      dispatch({
        type: "setAvailableDriverTypes", //we set the value of the driver types
        value: state.drivers.filter(
          (d) => d.driver === state.currentSelectedDriver
        ),
      });
    //do you need to clean up the currentSelectedDriver state after running this effect?
  }, [state.currentSelectedDriver, state.drivers]);

  useEffect(() => {
    state.availableDriverTypes.length !== 0 &&
      dispatch({
        type: "renderUrlsByDriverType",
        value: state.selectedDriverTypes,
      });
  }, [state.availableDriverTypes, state.selectedDriverTypes]);

  //need to figure out a way to update ALL copies of the URLS
  useEffect(() => {
    state.urlCollection.length > 0 &&
      dispatch({
        type: 'renderUrls'
      })
  }, [state.urlCollection])

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
            <Grid item>
              <FormControl required fullWidth>
                <TextField
                  name='url'
                  label='URL'
                  error={!validateUrl(state.url) && state.url !== ""}
                  helperText={
                    !validateUrl(state.url) && state.url !== ""
                      ? "An invalid URL was provided - please check the input and try again."
                      : null
                  }
                  onChange={(e) =>
                    dispatch({ type: "setUrl", value: e.currentTarget.value })
                  }
                  InputProps={{
                    endAdornment:
                      validateUrl(state.url) && !state.url !== "" ? (
                        <InputAdornment position='end'>
                          {" "}
                          <CheckCircle color='success' />{" "}
                        </InputAdornment>
                      ) : null,
                  }}
                />
              </FormControl>
            </Grid>

            {/* Business Units */}
            <Grid item>
              <FormControl fullWidth required>
                <InputLabel>Business Unit</InputLabel>
                <Select
                  disabled={state.url.length === 0}
                  label='Business Units'
                  name='businessUnits'
                  value={state.businessUnitsField}
                  onChange={(e) =>
                    dispatch({
                      type: "setField",
                      fieldName: e.target.name,
                      value: e.target.value,
                    })
                  }>
                  {businessUnits.map(({ label, param }) => (
                    <MenuItem
                      key={param}
                      value={param}
                      onClick={() =>
                        dispatch({
                          type: APPEND_PARAM,
                          paramType: "source",
                          param: param,
                        })
                      }>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {state.businessUnitsField.length > 0 ? <FormControl fullWidth required>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  disabled={state.url.length === 0}
                  label='Subcategory'
                  name='businessUnitSubCategories'
                  value={state.businessUnitSubCategories}
                  onChange={(e) =>
                    dispatch({
                      type: "setField",
                      fieldName: e.target.name,
                      value: e.target.value,
                    })
                  }>
                  {businessUnitSubCategories
                    .map(({ label, param }) => (
                      <MenuItem
                        key={param}
                        value={param}
                        onClick={() =>
                          dispatch({
                            type: APPEND_PARAM,
                            paramType: "source_type",
                            param: param,
                          })
                        }>
                        {label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl> : null}
            </Grid>

            {/* Optional Therapeutic Areas */}
            <Grid item>
              <FormControl>
                <FormControlLabel
                  control={<Switch color='secondary' {...label} />}
                  label='Therapeutic Areas?'
                  name='therapeuticAreaSwitch'
                  checked={state.therapeuticAreaSwitchField}
                  onChange={() =>
                    dispatch({
                      type: "toggleFieldSwitch",
                      fieldType: "therapeuticArea",
                      param: "utm_therapeutic_area",
                    })
                  }
                />
              </FormControl>
            </Grid>

            {state.therapeuticAreaSwitchField ? (
              <Grid item>
                <FormControl fullWidth>
                  <Autocomplete
                    freeSolo
                    disableClearable={true}
                    disabled={state.errors.length > 0 || state.url.length === 0}
                    options={state.therapeuticAreas}
                    onSelectCapture={(e) =>
                      dispatch({
                        type: APPEND_PARAM,
                        paramType: "therapeutic_area",
                        param: state.therapeuticAreas.filter(
                          (el) => el.label === e.target.value
                        )[0].param,
                      })
                    }
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          helperText='Start typing a Therapeutic Area for autofill.'
                          label={"Therapeutic Areas"}
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      );
                    }}
                  />
                </FormControl>
              </Grid>
            ) : null}

            {/* Campaign Drivers */}
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <FormControl required fullWidth>
                  <InputLabel>Campaign Drivers</InputLabel>
                  <Select
                    disabled={state.disabledFields || state.errors.length > 0}
                    name='campaignDrivers'
                    label='Campaign Drivers'
                    value={state.campaignDriversField}
                    onChange={(e) =>
                      dispatch({
                        type: "setField",
                        fieldName: e.target.name,
                        value: e.target.value,
                      })
                    }>
                    {state.drivers.map((el) => (
                      <MenuItem
                        value={el.param}
                        key={el.param}
                        onClick={() => {
                          dispatch({
                            type: APPEND_PARAM,
                            paramType: "medium",
                            param: el.param,
                          });
                          dispatch({
                            type: "selectDriver",
                            fieldType: el.driver,
                          });
                        }}>
                        {el.driver}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            {/* Driver Types dropdown */}
            {state.currentSelectedDriver.length !== 0 && (
              <Grid item>
                <FormControl sx={{ m: 1, width: 300 }} fullWidth>
                  <InputLabel>Driver Types</InputLabel>
                  <Select
                    multiple
                    value={state.selectedDriverTypes}
                    onChange={(e) =>
                      dispatch({
                        type: "addDriverType",
                        value:
                          typeof e.target.value === "string"
                            ? e.target.value.split(",")
                            : e.target.value,
                      })
                    }
                    input={<OutlinedInput label='Driver Types' />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((val) => (
                          <Chip
                            color={"secondary"}
                            icon={socialIconHandler(val)}
                            key={val}
                            label={val}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}>
                    {state.availableDriverTypes.map(({ label, param }) => (
                      <MenuItem
                        key={label}
                        value={param}
                        style={getStyles(
                          label,
                          state.availableDriverTypes,
                          theme
                        )}
                        onClick={() =>
                          dispatch({
                            type: APPEND_PARAM,
                            paramType: "driver_type",
                            param: param,
                          })
                        }>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Campaign Name */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  name='campaign_name'
                  label='Campaign Name'
                  disabled={state.url.length === 0}
                  onChange={(e) => {
                    if (e.currentTarget.value === '') {
                      dispatch({ type: 'removeParam', paramType: 'campaign' })
                    } else {
                      dispatch({
                        type: APPEND_PARAM,
                        paramType: "campaign",
                        param: e.currentTarget.value
                      })
                    }
                  }
                  }
                />
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl>
                <FormControlLabel
                  control={<Switch color='secondary' {...label} />}
                  label='Shorten URLs with Bit.ly?'
                  name='bitlyFieldSwitch'
                  checked={state.bitlySwitch}
                  onChange={() =>
                    dispatch({
                      type: "toggleFieldSwitch",
                      fieldType: "bitly",
                    })
                  }
                />
              </FormControl>
            </Grid>

            {state.bitlyFieldSwitch ?
              <Box
                sx={{
                  border: "dashed 1px lightgrey",
                  borderRadius: "5pt",
                  padding: "1rem",
                }}>
                <Grid
                  container
                  direction='column'
                  justifyContent='center'
                  alignItems='stretch'
                  rowGap={2}>
                  <TextField
                    label='Bit.ly Access Token'
                    value={state.bitlyAccessTokenField}
                    fullWidth
                    multiline
                    onChange={(e) =>
                      dispatch({
                        type: "setBitlyAccessToken",
                        value: e.currentTarget.value,
                      })
                    }
                  />
                  <Button
                    color='secondary'
                    disabled={state.bitlyAccessTokenField === ""}
                    fullWidth
                    onClick={() =>
                      dispatch({
                        type: "setBitlyURLs",
                        value: state.urlsByDriverType.map((url) =>
                          shortenURL(
                            encodeURI(url.fullUrl),
                            state.bitlyAccessTokenField
                          )
                        ),
                      })
                    }
                    variant='contained'>
                    Shorten URLs (with Bit.ly)
                  </Button>
                </Grid>
              </Box> : null}

            <Typography variant="h6">Results:</Typography>
            {state.urlsByDriverType.length > 0
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
            <Button onClick={() => dispatch({ type: 'renderUrls' })} variant='contained'>Generate URLs</Button>
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
