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
  Link,
} from "@mui/material";
import { useEffect, useState, useRef } from 'react'
import { APPEND_PARAM } from "../../Reducers/actionTypes";
import { MenuProps, getStyles, socialIconHandler } from "../../Utils";
import { v4 as uuidv4 } from 'uuid'
import { InstanceUrl } from "../../Reducers/urlBuildReducer";
import { DeleteOutline } from "@mui/icons-material";

export function CampaignDrivers({ dispatchHandler, formState, type }) {
  const [fieldId, setFieldId] = useState()
  const [driverList, setDriverList] = useState(formState.drivers)
  const [driverTypes, setDriverTypes] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [driver, setDriver] = useState()
  const theme = useTheme();

  useEffect(() => {
    const componentId = uuidv4()
    setFieldId(componentId)
  }, [])

  useEffect(() => {
    // dispatchHandler({ type: 'addDrivers', driverType: type })
    return () => {
      dispatchHandler({ type: 'removerDrivers', driverType: type })
    }
  }, [])

  return (
    <>
      <Grid spacing={2} item>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <FormControl required fullWidth>
            <InputLabel>Campaign Drivers</InputLabel>
            <Select
              disabled={formState.errors.length > 0}
              name={`campaignDriver`}
              label='Campaign Drivers'
              value={driver}
              onChange={(e) => {
                setDriver(e.target.value)
                if (selectedTypes.length > 0) {
                  setSelectedTypes([])
                  dispatchHandler({ type: 'removeUrls', driverType: type })
                }
                setDriverTypes(driverList.filter(d => d.param === e.target.value)[0].type)
              }}>
              {driverList.map((el) => (
                <MenuItem
                  value={el.param}
                  key={el.param}
                  onClick={(e) => {
                    setDriverTypes(e.target.value)
                    //   dispatchHandler({
                    //     type: APPEND_PARAM,
                    //     paramType: "medium",
                    //     param: el.param,
                    //   });
                    //   dispatchHandler({
                    //     type: "selectDriver",
                    //     fieldType: el.driver,
                    //     fieldId: fieldId
                    //   });
                    // }}>
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
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => (
                      <Grow
                        key={val}
                        in={driver.length !== 0}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(driver.length !== 0
                          ? { timeout: 500 }
                          : {})}>
                        <Chip
                          onDelete={(e) => dispatchHandler({ type: 'removeUrl', id: val })}
                          deleteIcon={<DeleteOutline />}
                          color={"secondary"}
                          icon={socialIconHandler(val)}
                          label={val}
                        />
                      </Grow>
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}>
                {driverTypes.map(({ label, param }) => (
                  <MenuItem
                    id={uuidv4()}
                    key={label}
                    value={param}
                    style={getStyles(label, driverTypes, theme)}
                    onClick={(e) => {
                      let url = new InstanceUrl(formState.url, type)
                      url.searchParams.append('utm_driver_type', param)

                      dispatchHandler({ type: 'addUrl', value: url })
                    }}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant='contained'
                onClick={(e) => {
                  console.log()
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
