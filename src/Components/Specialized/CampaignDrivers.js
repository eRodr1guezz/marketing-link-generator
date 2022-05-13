import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box,
  MenuItem,
  OutlinedInput,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { RemoveCircleOutlineOutlined } from "@mui/icons-material";
import { useState } from "react";
import {
  ADD_CHILD_URL_TO_CAMPAIGN,
  REMOVE_DRIVER,
} from "../../Reducers/actionTypes";
import { MenuProps, getStyles, socialIconHandler } from "../../Utils";
import { drivers } from "../../internal";
// import CustomParamAccordion from "./CustomParamAccordion";
//TODO: Custom parameters by driver type in an accordion ui component
//TODO: Solve the duplicate driver bug (drivers overwrite if accidentally selected twice)

export function CampaignDrivers({ dispatchHandler, formState, driverId }) {
  const [driverTypes, setDriverTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [driver, setDriver] = useState("");
  const [driverData,] = useState(drivers);

  const theme = useTheme();

  function changeHandler(e) {
    let result =
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value;
    setSelectedTypes(result);
    dispatchHandler({
      type: ADD_CHILD_URL_TO_CAMPAIGN,
      value: result,
      driverId,
      driver,
    });
  }

  return (
    <>
      <Grid id={driverId} item>
        <Box
          sx={{
            gap: '1rem',
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControl required fullWidth>
            <InputLabel>Campaign Drivers</InputLabel>
            <Select
              disabled={formState.url === ""}
              name={`campaignDriver`}
              label="Campaign Drivers"
              value={driver}
              onChange={(e) => {
                setDriver(e.target.value);
                if (selectedTypes.length > 0) {
                  setSelectedTypes([]);
                  dispatchHandler({ type: REMOVE_DRIVER, driver });
                }
                setDriverTypes(
                  drivers.filter((d) => d.param === e.target.value)[0].type
                );
              }}
            >
              {driverData.map((el) => (
                <MenuItem
                  value={el.param}
                  key={el.param}
                  onClick={(e) => {
                    if (driverTypes === e.target.value) {
                      setDriverTypes(e.target.value);
                    }
                  }}
                >
                  {el.driver}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {driverId && driverId !== 10000 ? (
            <IconButton
              onClick={() =>
                dispatchHandler({
                  type: REMOVE_DRIVER,
                  driver,
                  driverId,
                })
              }
            >
              <Tooltip title='Remove Driver'>
                <RemoveCircleOutlineOutlined htmlColor="gray" />
              </Tooltip>
            </IconButton>
          ) : null}
        </Box>
      </Grid>

      {driver && driverTypes.length > 0 && (
        <Grid item>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Driver Types</InputLabel>
            <Select
              multiple
              value={selectedTypes}
              onChange={(e) => changeHandler(e)}
              input={<OutlinedInput label="Driver Types" />}
              renderValue={() => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedTypes.map((val) => (
                    <Chip
                      key={val}
                      color={"secondary"}
                      icon={socialIconHandler(val)}
                      label={val}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {driverTypes.map(({ label, param }) => {
                return (
                  <MenuItem
                    key={label}
                    value={param}
                    style={getStyles(label, driverTypes, theme)}
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
            {
              <Box>
                {/* {
                    driverTypes.length > 0 && driverTypes && selectedTypes.map(type => (
                      <CustomParamAccordion
                        title={type}
                        formState={formState}
                        dispatchHandler={dispatchHandler}
                      />
                    ))
                  } */}
              </Box>
            }
          </FormControl>
        </Grid>

      )}
    </>
  );
}
