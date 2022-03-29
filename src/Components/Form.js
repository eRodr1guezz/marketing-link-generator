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
} from "@mui/material";
import { HelpOutlineOutlined } from "@mui/icons-material";
import useSnackbar from "../Hooks/useSnackbar";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [, setVehicleTypeValue] = useState([])
  const { isOpen, alertType, message, openSnackBar } = useSnackbar()

  const label = { inputProps: { 'aria-label': 'Therapeutic Areas?' } }

  function copy(url) {
    if (url.length === 0) {
      dispatch({ type: 'error', value: 'No URL to copy! Enter a URL and try again.' })
    } else {
      navigator.clipboard.writeText(url)
      openSnackBar('URL copied successfully!', 'success')
    }
  }

  useEffect(() => {
    if (state.errors.length > 0) {
      openSnackBar(state.errors, 'error')
    }
  }, [state.errors])

  useEffect(() => {
    state.currentSelectedDriver.length > 0 && setVehicleTypeValue(state.drivers.filter(d => d.driver === state.currentSelectedDriver))
  }, [state.currentSelectedDriver, state.drivers])

  return (
    <>
      {isOpen ? <SimpleSnackbar type={alertType} message={message} isOpen={true} /> : null}
      <div className='form-wrapper'>
        <h1 style={{ fontWeight: 800, fontSize: '4rem' }}>Campaign URL Builder</h1>
        <FormControl
          required
          fullWidth
        >
          <TextField
            label="URL"
            error={state.isURLInvalid}
            helperText={state.isURLInvalid ? 'An invalid URL was provided - please check the input and try again.' : null}
            onChange={(e) => dispatch({ type: 'setUrl', value: e.currentTarget.value })}
          />
        </FormControl>

        {/* Campaign Drivers */}
        <FormControl required fullWidth>
          <InputLabel>Campaign Drivers</InputLabel>
          <Select
            disabled={state.disabledFields || state.errors.length > 0}
            name="campaignDrivers"
            label="Campaign Drivers"
            value={state.campaignDriversField}
            onChange={e => dispatch({ type: 'setField', fieldName: e.target.name, value: e.target.value })}
          >
            {state.drivers.map(el => (
              <MenuItem value={el.param}
                key={el.param}
                onClick={() => {
                  dispatch({ type: 'appendParam', paramType: 'source', param: el.param })
                  dispatch({ type: 'select', fieldType: el.driver })
                }
                }>
                {el.driver}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {state.selectedDriverTypes.length > 0 ?
          <FormControl fullWidth>
            <InputLabel>Driver Vehicle Type</InputLabel>
            <Select
              label="Driver Vehicle Type"
              name="vehicleTypes"
              disabled={state.disabledFields}
              value={state.vehicleTypesField}
              onChange={e => dispatch({ type: 'setField', fieldName: e.target.name, value: e.target.value })}
            >
              {state.selectedDriverTypes.map(({ label, param }) => (
                <MenuItem
                  key={param}
                  value={param}
                  onClick={() => dispatch({ type: 'appendParam', paramType: 'vehicleTypes', param: param })}
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl> : null
        }

        <FormControl fullWidth>
          <Select
            label="Business Unit"
            name="businessUnits"
            onChange={e => dispatch({ type: 'setField', fieldName: e.target.name, value: e.target.value })}
          >
            {state.businessUnits.map(({ label, param }) => (
              <MenuItem
                key={param}
                value={param}
                onClick={() => dispatch({ type: 'appendParam', paramType: 'businessUnit', param: param })}
              >
                {label}
              </MenuItem>
            ))}

          </Select>
        </FormControl>

        <FormControl>
          <FormControlLabel
            control={<Switch color="secondary" {...label} />}
            label="Therapeutic Areas?"
            name="therapeuticAreaSwitch"
            checked={state.therapeuticAreaSwitchField}
            onChange={() => dispatch({ type: 'toggleTherapeuticAreaSwitch' })}
          />
        </FormControl>

        {state.therapeuticAreaSwitchField ?
          <FormControl fullWidth>
            <Autocomplete
              freeSolo
              disableClearable={true}
              disabled={state.errors.length > 0 || state.url.length === 0}
              options={state.therapeuticAreas}
              onSelectCapture={(e) => dispatch({ type: 'appendParam', paramType: 'therapeuticArea', param: state.therapeuticAreas.filter(el => el.label === e.target.value)[0].param })}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    helperText="Start typing a Therapeutic Area for autofill."
                    label={'Therapeutic Areas'}
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )
              }}
            />
          </FormControl> : null
        }
        <TextField
          label="Generated URL"
          rows={4}
          value={encodeURI(state.url)}
          fullWidth
          multiline
        />

        <Button onClick={() => copy(state.url)} variant='contained'>COPY URL</Button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <HelpOutlineOutlined fontSize="small" color='secondary' />
          <Link underline="always" variant="body2" style={{ textAlign: 'right', textDecoration: 'none' }} href='mailto:babruzese@medscapelive.com'>Issues with the URL builder? Get in touch!</Link>
        </div>
      </div>
    </>
  );
}
