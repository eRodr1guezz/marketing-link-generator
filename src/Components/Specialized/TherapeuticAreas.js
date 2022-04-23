import FormAutocomplete from "../FormAutocomplete";
import FormFieldSwitch from "../FormFieldSwitch";
import { Grid, FormControl } from '@mui/material'
import { useState } from 'react'
import { therapeuticAreas } from "../../internal";

export default function TherapeuticAreas({
  dispatchHandler,
  formState
}) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState()

  return (
    <Grid item>
      <FormControl>
        <FormFieldSwitch
          changeHandler={dispatchHandler({})}
          labelText={"Therapeutic Areas?"}
          checkedState={visible}
        />
        {visible && (
          <FormAutocomplete
            innerLabel="Therapeutic Areas"
            freeSolo={true}
            textFieldType="search"
            options={therapeuticAreas}
            handleChange={(e) => inputHandler(e)}
          />
        )}
      </FormControl>
    </Grid>
  );
}
