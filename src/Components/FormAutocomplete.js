import { Autocomplete, FormControl, TextField } from "@mui/material";

export default function FormAutocomplete({
  handleChange,
  name,
  options,
  disabled,
  textFieldType,
  freeSolo,
  innerLabel,
}) {
  return (
    <>
    <FormControl>
    <Autocomplete
      disableClearable={true}
      freeSolo={freeSolo}
      options={options}
      disabled={disabled}
      onSelectCapture={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={innerLabel}
          InputLabelProps={{ "aria-label": 'Therapeutic Areas' }}
          InputProps={{ ...params.InputProps, type: textFieldType }}
        />
      )}
    />
    </FormControl>
    </>
  );
}
