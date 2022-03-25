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
  FormHelperText,
} from "@mui/material";
import { HelpOutlined, HelpOutlineOutlined } from "@mui/icons-material";

//need help ? link - sends auto message to me / inbox - questions, concerns etc.
export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [, setVehicleTypeValue] = useState([])

  useEffect(() => {
    setVehicleTypeValue(state.drivers.filter(d => d.driver === state.currentSelectedDriver))
  }, [state.currentSelectedDriver, state.drivers])

  return (
    <>
      {state.errors.length !== 0 &&
        <SimpleSnackbar
          visible={true}
          message={state.errors && state.errors[0].msg}
        />
      }
      <div className='form-wrapper'>
        <h1 style={{ fontWeight: 800, fontSize: '4rem' }}>Campaign URL Builder</h1>
        <FormControl
          required
          fullWidth
        >
          <TextField
            label="URL"
            error={state.isURLInvalid}
            onChange={(e) => dispatch({ type: 'url', value: e.currentTarget.value })}
          />
        </FormControl>

        {/* Campaign Drivers */}
        <FormControl required fullWidth>
          <InputLabel>Campaign Drivers</InputLabel>
          <Select
            disabled={state.disabledFields}
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

        {state.driverTypesVisibility ?
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


        {/* Vehicle Class aka Business Unit */}

        {/* <Autocomplete
            options={state.areas}
            onChange={(e, newValue) => {
              if (!newValue) {
                return
              } else {
                setValue(newValue)
                newValue.id && dispatch({ type: 'appendParam', paramType: 'vehicleClass', param: newValue.id })
              }
            }}
            onInputChange={(e, newInputValue) => {
              setInputValue(newInputValue)
            }}
            inputValue={inputValue}
            value={value}
            selectOnFocus
            clearOnBlur
            disablePortal
            renderInput={(params) => {
              return <TextField {...params} label={'Business Unit'} />
            }}
          /> */}
        {/* <FormControl fullWidth>
          <InputLabel>Business Unit</InputLabel>
          <Select
            value={businessUnit}
          >
            {
              state.businessUnits.map(({ label, param }) => (
                <MenuItem
                  value={param}
                  onClick={() => dispatch({ type: 'appendParam', paramType: 'vehicleClass', param: param })}
                >
                  {label}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl> */}

        {/* <FormControl required fullWidth>
          <InputLabel>Therapeutic Areas</InputLabel>
          <Select
            disabled={state.disabledFields}
            value={state.therapeuticAreasField}
            label="Therapeutic Areas"
            name="therapeuticAreas"
            onChange={e => {
              dispatch({ type: 'setField', fieldName: e.target.name, value: e.target.value })
              dispatch({ type: 'getEntity', param: e.target.value, entity: e.target.name })
            }}
          >
            {state.therapeuticAreas.map(({ label, param }) => (
              <MenuItem
                value={param}
                onClick={() => dispatch({ type: 'appendParam', paramType: 'therapeuticArea', param: param })}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <FormControl fullWidth>
          <Autocomplete
            freeSolo
            disableClearable={true}
            options={state.therapeuticAreas}
            onSelectCapture={(e) => dispatch({ type: 'appendParam', paramType: 'therapeuticArea', param: state.therapeuticAreas.filter(el => el.label === e.target.value)[0].param })}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={'Therapeutic Areas'}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )
            }}
          />
          <FormHelperText>Start typing a Therapeutic Area for autofill.</FormHelperText>
        </FormControl>

        <TextField
          label="Generated URL"
          rows={4}
          value={encodeURI(state.url)}
          fullWidth
          multiline
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <HelpOutlineOutlined fontSize="small" color='secondary' />
          <Link underline="always" variant="body2" style={{ textAlign: 'right', textDecoration: 'none' }} href='mailto:babruzese@medscapelive.com'>Issues with the URL builder? Get in touch!</Link>
        </div>
      </div>
    </>
  );
}
