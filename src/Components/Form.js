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
  Tooltip,
  IconButton,
  InputBase,
  Divider,
  InputAdornment,
  FormGroup,
  List,
  Grow,
  ButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CheckCircle,
  ContentCopy,
  HelpOutlineOutlined,
  LinkRounded,
  AddCircle,
  RemoveCircle,
  AddCircleOutlineTwoTone,
} from "@mui/icons-material";
import { BitlyIcon } from "../bitlyIcon";
import useSnackbar from "../Hooks/useSnackbar";
import {
  socialIconHandler,
  validateUrl,
} from "../Utils";
import { businessUnits, businessUnitSubCategories } from "../internal";
import { UrlList } from "./UrlList";
import { APPEND_PARAM, SET_AVAILABLE_DRIVER_TYPES } from "../Reducers/actionTypes";
import { CampaignDrivers } from "./Specialized/CampaignDrivers";

export default function Form() {
  const theme = useTheme();
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();
  const fieldRef = useRef(null);

  const label = { inputProps: { "aria-label": "Therapeutic Areas?" } };

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
        type: SET_AVAILABLE_DRIVER_TYPES,
        value: state.drivers.filter(
          (d) => d.driver === state.currentSelectedDriver
        ),
      });
  }, [state.currentSelectedDriver, state.drivers]);

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

            {/* Campaign Name */}
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  name='campaign_name'
                  label='Campaign Name'
                  value={state.campaign_nameField || ""}
                  disabled={state.url.length === 0}
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

            {/* Business Units */}
            <Grid item>
              <FormControl fullWidth required>
                <InputLabel>Business Unit</InputLabel>
                <Select
                  disabled={state.url.length === 0}
                  label='Business Units'
                  name='businessUnits'
                  value={state.businessUnitsField || ""}
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
            </Grid>

            {state.businessUnitsField && state.businessUnitsField.length > 0 && (
              <Grow
                in={state.businessUnitsField.length > 0}
                style={{ transformOrigin: "0 0 0" }}
                {...(state.businessUnitsField.length > 0
                  ? { timeout: 1000 }
                  : {})}>
                <FormControl required fullWidth>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    disabled={state.url.length === 0}
                    label='Subcategory'
                    name='businessUnitSubCategories'
                    value={state.businessUnitSubCategoriesField || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "setField",
                        fieldName: e.target.name,
                        value: e.target.value,
                      })
                    }>
                    {businessUnitSubCategories.map(({ label, param }) => (
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
                </FormControl>
              </Grow>
            )}

            {/* Optional Therapeutic Areas */}
            <Grid item>
              <FormControl>
                <FormControlLabel
                  control={<Switch color='secondary' {...label} />}
                  label='Therapeutic Areas?'
                  name='therapeuticAreaSwitch'
                  checked={state.therapeuticAreaFieldSwitch}
                  disabled={state.url === "" && !state.businessUnitsField}
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
            {state.therapeuticAreaFieldSwitch ? (
              <Grid item>
                <Grow
                  in={
                    state.businessUnitsField &&
                    state.businessUnitsField.length > 0
                  }
                  style={{ transformOrigin: "0 0 0" }}
                  {...(state.businessUnitsField.length > 0
                    ? { timeout: 1000 }
                    : {})}>
                  <FormControl fullWidth>
                    <Autocomplete
                      freeSolo
                      disableClearable={true}
                      disabled={
                        state.errors.length > 0 || state.url.length === 0
                      }
                      options={state.therapeuticAreas}
                      value={state.therapeuticAreaField || ""}
                      onSelect={(e) => {
                        dispatch({
                          type: "setField",
                          fieldName: "therapeuticArea",
                          value: e.target.value,
                        });
                        dispatch({
                          type: APPEND_PARAM,
                          paramType: "therapeutic_area",
                          param:
                            e.currentTarget.value !== undefined &&
                            state.therapeuticAreas.filter(
                              (el) => el.label === e.target.value
                            )[0].param,
                        });
                      }}
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
                </Grow>
              </Grid>
            ) : null}

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

            <UrlList businessUnitsFieldLength={state.generatedUrls.length}>
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
            </UrlList>

            <Box
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
            </Box>

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
