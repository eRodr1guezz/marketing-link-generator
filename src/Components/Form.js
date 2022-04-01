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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ContentCopy,
  Facebook,
  HelpOutlineOutlined,
  Instagram,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import useSnackbar from "../Hooks/useSnackbar";

const APPEND_PARAM = "appendParam";

function socialIconHandler(param) {
  switch (param) {
    case "twi":
      return <Twitter />;
    case "li":
      return <LinkedIn />;
    case "fb":
      return <Facebook />;
    case "in":
      return <Instagram />;
    default:
      return null;
  }
}

export default function Form() {
  const theme = useTheme();
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();
  const fieldRef = useRef(null)

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
          // dispatch({ type: 'setBitlyURL', value: data.link })
          return data.link;
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
            alignItems='stretch'
            rowGap={2}
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
                  error={state.isURLInvalid}
                  helperText={
                    state.isURLInvalid
                      ? "An invalid URL was provided - please check the input and try again."
                      : null
                  }
                  onChange={(e) =>
                    dispatch({ type: "setUrl", value: e.currentTarget.value })
                  }
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
                  {state.businessUnits.map(({ label, param }) => (
                    <MenuItem
                      key={param}
                      value={param}
                      onClick={() =>
                        dispatch({
                          type: APPEND_PARAM,
                          paramType: "businessUnit",
                          param: param,
                        })
                      }>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    dispatch({ type: "toggleTherapeuticAreaSwitch" })
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
                        paramType: "therapeuticArea",
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
                            paramType: "source",
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
                          <Tooltip title={"the label somehow"}>
                            <Chip
                              color={'secondary'}
                              icon={socialIconHandler(val)}
                              key={val}
                              label={val}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}>
                    {state.availableDriverTypes.map(({ label, param }) => (
                      <MenuItem
                        key={param}
                        value={param}
                        style={getStyles(
                          label,
                          state.availableDriverTypes,
                          theme
                        )}
                        onClick={() =>
                          dispatch({
                            type: APPEND_PARAM,
                            paramType: "driverTypes",
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

            {state.urlsByDriverType.length > 0
              ? state.urlsByDriverType.map((el) => {
                const elUrl = new URL(el)
                const socialCode = elUrl.searchParams.get('utm_driverTypes')

                return (
                  <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#efefef' }}
                  >
                    <IconButton sx={{ p: '8px' }} aria-label="driver copy bar">
                      {socialIconHandler(socialCode)}
                    </IconButton>
                    <InputBase
                      ref={fieldRef}
                      sx={{ ml: 1, flex: 1, color: '#666' }}
                      value={elUrl.href}
                      inputProps={{ 'aria-label': 'copy url instance' }}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton onClick={(e) => dispatch({ type: 'copyUrl', value: fieldRef.current.childNodes[0] })} sx={{ p: '10px' }} aria-label="copy url">
                      <ContentCopy />
                    </IconButton>
                  </Paper>
                )
              }) : null}

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
                        shortenURL(encodeURI(url), state.bitlyAccessTokenField)
                      ),
                    })
                  }
                  variant='contained'>
                  Shorten URLs (with Bit.ly)
                </Button>
              </Grid>
            </Box>
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
