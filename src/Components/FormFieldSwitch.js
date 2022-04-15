import { FormControl, FormControlLabel, Switch } from "@mui/material";

const label = { inputProps: { "aria-label": "Therapeutic Areas?" } };

export default function FormFieldSwitch({
  labelText,
  name,
  checkedState,
  changeHandler,
}) {
  return ( 
  <FormControl>
    <FormControlLabel
      control={<Switch color="secondary" {...label} />}
      label={labelText}
      name={name}
      checked={checkedState}
      onChange={changeHandler}
    />
  </FormControl>)
}
