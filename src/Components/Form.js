/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useState, useEffect } from "react";
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
} from "@mui/material";
import { HelpOutlineOutlined } from "@mui/icons-material";
import useSnackbar from "../Hooks/useSnackbar";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [, setVehicleTypeValue] = useState([]);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();

  const label = { inputProps: { "aria-label": "Therapeutic Areas?" } };

  const bitlyURL = `https://api-ssl.bitly.com/v4/shorten`;

  async function shortenURL(url, access_token) {
    await fetch(bitlyURL, {
      method: "POST",
      body: JSON.stringify({
        // group_guid: "o_5kc1f828jm",
        long_url: url
      }),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access_token}` },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === 'FORBIDDEN') {
          dispatch({ type: 'error', value: 'Invalid access token. Please check and try again.' })
        } else {
          dispatch({ type: 'setBitlyURL', value: data.link })
        }
      })
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
    state.currentSelectedDriver.length > 0 &&
      setVehicleTypeValue(
        state.drivers.filter((d) => d.driver === state.currentSelectedDriver)
      );
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
                          type: "appendParam",
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
                            type: "appendParam",
                            paramType: "source",
                            param: el.param,
                          });
                          dispatch({ type: "select", fieldType: el.driver });
                        }}>
                        {el.driver}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {state.selectedDriverTypes.length > 0 ? (
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel>Driver Vehicle Type</InputLabel>
                  <Select
                    label='Driver Vehicle Type'
                    name='vehicleTypes'
                    disabled={state.disabledFields}
                    value={state.vehicleTypesField}
                    onChange={(e) =>
                      dispatch({
                        type: "setField",
                        fieldName: e.target.name,
                        value: e.target.value,
                      })
                    }>
                    {state.selectedDriverTypes.map(({ label, param }) => (
                      <MenuItem
                        key={param}
                        value={param}
                        onClick={() =>
                          dispatch({
                            type: "appendParam",
                            paramType: "vehicleTypes",
                            param: param,
                          })
                        }>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}

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
                        type: "appendParam",
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

            <TextField
              label='Generated URL'
              rows={4}
              value={encodeURI(state.url)}
              fullWidth
              multiline
            />
            <Button
              fullWidth
              onClick={() =>
                dispatch({ type: "copyUrl", value: encodeURI(state.url) })
              }
              variant='contained'>
              COPY URL
            </Button>

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
                  onChange={e => dispatch({ type: 'setBitlyAccessToken', value: e.currentTarget.value })}
                />
                <TextField
                  label='Bit.ly URL'
                  value={state.bitlyUrlField}
                  fullWidth
                  multiline
                />
                <Button
                  color='secondary'
                  disabled={state.bitlyAccessTokenField === ''}
                  fullWidth
                  onClick={() =>
                    dispatch({ type: "setBitlyURL", value: shortenURL(encodeURI(state.url), state.bitlyAccessTokenField) })
                  }
                  variant='contained'>
                  Shorten URL (with Bit.ly)
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
