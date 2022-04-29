import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box,
  Grow,
  MenuItem,
  OutlinedInput,
  Chip,
  useTheme,
  Button,
} from "@mui/material";
import { useEffect, useState } from 'react'
import { APPEND_PARAM, REMOVE_URL, REMOVE_ALL_DRIVERS_BY_TYPE, ADD_URL } from "../../Reducers/actionTypes";
import { MenuProps, getStyles, socialIconHandler } from "../../Utils";
import { InstanceUrl } from "../../Reducers/urlBuildReducer";
import { drivers } from "../../internal";
import { DeleteOutlined } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid'

export function CampaignDrivers({ dispatchHandler, formState, type }) {
  const [fieldId, setFieldId] = useState()
  const [driverTypes, setDriverTypes] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [driver, setDriver] = useState()
  const theme = useTheme();

  return (
    <>
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
              disabled={formState.url === ''}
              name={`campaignDriver`}
              label='Campaign Drivers'
              value={driver || ''}
              onChange={(e) => {
                setDriver(e.target.value)
                if (selectedTypes.length > 0) {
                  setSelectedTypes([])
                  dispatchHandler({ type: REMOVE_ALL_DRIVERS_BY_TYPE, driverType: type })
                }
                setDriverTypes(drivers.filter(d => d.param === e.target.value)[0].type)
              }}>
              {drivers.map((el) => (
                <MenuItem
                  value={el.param}
                  key={el.param}
                  onClick={(e) => {
                    setDriverTypes(e.target.value)
                      dispatchHandler({
                        type: APPEND_PARAM,
                        paramType: "medium",
                        param: el.param,
                      });
                  }}>
                  {el.driver}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      {driverTypes.length !== 0 && (
        <Grow
          in={driverTypes.length !== 0}
          style={{ transformOrigin: "0 0 0" }}
          {...(driverTypes.length !== 0 ? { timeout: 1000 } : {})}>
          <Grid item>
            <FormControl sx={{ m: 1, width: 300 }} fullWidth>
              <InputLabel>Driver Types</InputLabel>
              <Select
                multiple
                value={selectedTypes}
                onChange={(e) => {
                  setSelectedTypes(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
                }}
                input={<OutlinedInput label='Driver Types' />}
                renderValue={() => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedTypes.map((val) => (
                      <Grow
                        key={val}
                        in={driver.length !== 0}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(driver.length !== 0
                          ? { timeout: 500 }
                          : {})}>
                        <Chip
                          deleteIcon={
                            <DeleteOutlined 
                              onMouseDown={e => e.stopPropagation()} 
                            />
                          }
                          clickable
                          onDelete={e => { 
                            let filtered = selectedTypes.filter(el => el !== val)
                            setSelectedTypes(filtered)
                            dispatchHandler({ type: REMOVE_URL, id: fieldId})
                          }}
                          color={"secondary"}
                          icon={socialIconHandler(val)}
                          label={val}
                        />
                      </Grow>
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}>
                {driverTypes.map(({ label, param }) => {
                  return (
                    <MenuItem
                      key={label}
                      value={param}
                      style={getStyles(label, driverTypes, theme)}
                      onClick={(e) => {
                        let uniqueId = uuidv4()
                        let url = new InstanceUrl(formState.url, uniqueId)
                        url.searchParams.append('utm_driver_type', param)

                        dispatchHandler({ type: ADD_URL, value: url })
                      }}>
                    {label}
                    </MenuItem>
                  )
                })}
              </Select>
              <Button
                variant='contained'
                onClick={(e) => {
                  console.log(e)
                  // dispatchHandler({ type: 'removeUrl', id: e.id })
                }}
                color='error'>Remove Driver?</Button>
            </FormControl>
          </Grid>
        </Grow>
      )}
    </>
  );
}
