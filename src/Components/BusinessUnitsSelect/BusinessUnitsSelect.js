import { Grid, FormControl, InputLabel, Select, MenuItem, Grow } from '@mui/material'
import { useState } from 'react'
import { APPEND_PARAM } from '../../Reducers/actionTypes'
import { businessUnits, businessUnitSubCategories } from '../../internal'

export function BusinessUnitsSelect({ formState, dispatchHandler }) {
  const [value, setValue] = useState()
  const [subValue, setSubValue] = useState()

  return (
    <>
      <Grid item>
        <FormControl fullWidth required>
          <InputLabel>Business Unit</InputLabel>
          <Select
            disabled={formState.url === ''}
            label='Business Units'
            name='businessUnits'
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}>
            {businessUnits.map(({ label, param }) => (
              <MenuItem
                key={param}
                value={param}
                onClick={() =>
                  dispatchHandler({
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
      {
        value && (
          <Grow
            in={value.length > 0}
            style={{ transformOrigin: "0 0 0" }}
            {...(value.length > 0
              ? { timeout: 1000 }
              : {})}>
            <Grid item>
              <FormControl required fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  disabled={formState.url === ''}
                  label='Subcategory'
                  name='businessUnitSubCategories'
                  value={subValue || ""}
                  onChange={(e) => setSubValue(e.target.value)}>
                  {businessUnitSubCategories.map(({ label, param }) => (
                    <MenuItem
                      key={param}
                      value={param}
                      onClick={() =>
                        dispatchHandler({
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
            </Grid>
          </Grow>
        )}
    </>
  )
}