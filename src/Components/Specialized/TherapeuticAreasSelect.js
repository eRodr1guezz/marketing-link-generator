import { Grid, FormControl, FormControlLabel, Switch, Grow, Autocomplete, TextField } from '@mui/material'
import { useState } from 'react'
import { therapeuticAreas } from "../../internal";
import { APPEND_PARAM, REMOVE_PARAM } from '../../Reducers/actionTypes';

export function TherapeuticAreasSelect({
  dispatchHandler,
  formState
}) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const label = { inputProps: { "aria-label": "Therapeutic Areas?" } };

  function handleSwitch(type) {
    if (visible) {
      setVisible(false)
      dispatchHandler({ type: REMOVE_PARAM, paramType: type })
    } else {
      setVisible(true)
    }
  }

  return (
    <>
      <Grid item>
        <FormControl>
          <FormControlLabel
            control={<Switch color='secondary' {...label} />}
            label='Therapeutic Areas?'
            name='therapeuticAreaSwitch'
            checked={visible}
            disabled={formState.url === ""}
            onChange={e => handleSwitch('therapeutic_area')}
          />
        </FormControl>
      </Grid>
      {visible &&
        <Grid item>
          <Grow
            in={visible}
            style={{ transformOrigin: "0 0 0" }}
            {...(visible
              ? { timeout: 1000 }
              : {})}>
            <FormControl fullWidth>
              <Autocomplete
                freeSolo
                disableClearable={true}
                disabled={formState.url === ''}
                options={therapeuticAreas}
                value={value}
                onSelect={(e) => {
                  setValue(e.target.value)
                  dispatchHandler({
                    type: APPEND_PARAM,
                    paramType: "therapeutic_area",
                    param:
                      e.target.value !== undefined &&
                      therapeuticAreas.filter(
                        (el) => el.label === e.target.value
                      )[0].param,
                  });
                }}
                renderInput={params => {
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
      }
    </>
  )
}
