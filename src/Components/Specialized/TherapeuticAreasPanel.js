import FormAutocomplete from "../FormAutocomplete";
import FormFieldSwitch from "../FormFieldSwitch";
import { Grid, FormControl } from '@mui/material'

export default function TherapeuticAreasPanel({
  switchHandler,
  inputHandler,
  disabled,
  options,
  visible,
}) {
  return (
      <Grid item>
      <FormControl>
      <FormFieldSwitch
        changeHandler={switchHandler}
        labelText={"Therapeutic Areas?"}
        checkedState={visible}
      />
      {visible && (
        <FormAutocomplete
          disabled={disabled}
          innerLabel="Therapeutic Areas"
          freeSolo={true}
          textFieldType="search"
          options={options}
          handleChange={(e) => inputHandler(e)}
        />
      )}
      </FormControl>
      </Grid>
  );
}
