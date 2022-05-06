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
  IconButton,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useState } from "react";
import {
  ADD_CHILD_URL_TO_CAMPAIGN,
  REMOVE_DRIVER,
} from "../../Reducers/actionTypes";
import { MenuProps, getStyles, socialIconHandler } from "../../Utils";
import { drivers } from "../../internal";

export function CampaignDrivers({ dispatchHandler, formState, driverId }) {
  const [driverTypes, setDriverTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [driver, setDriver] = useState("");

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
              {drivers.map((el) => (
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
              <DeleteOutlined />
            </IconButton>
          ) : null}
        </Box>
      </Grid>

      {driverTypes.length > 0 && (
        <Grow
          in={driverTypes.length > 0}
          style={{ transformOrigin: "0 0 0" }}
          {...(driverTypes.length > 0 ? { timeout: 500 } : {})}
        >
          <Grid item>
            <FormControl sx={{ m: 1, width: 300 }} fullWidth>
              <InputLabel>Driver Types</InputLabel>
              <Select
                fullWidth
                multiple
                value={selectedTypes}
                onChange={(e) => changeHandler(e)}
                input={<OutlinedInput label="Driver Types" />}
                renderValue={() => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedTypes.map((val) => (
                      <Grow
                        key={val}
                        in={driver.length !== 0}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(driver.length !== 0 ? { timeout: 500 } : {})}
                      >
                        <Chip
                          color={"secondary"}
                          icon={socialIconHandler(val)}
                          label={val}
                        />
                      </Grow>
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
            </FormControl>
          </Grid>
        </Grow>
      )}
    </>
  );
}
