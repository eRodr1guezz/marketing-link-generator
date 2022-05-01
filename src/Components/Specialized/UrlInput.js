import { Grid, FormControl, TextField, InputAdornment } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { validateUrl } from '../../Utils/index'
import { SET_URL } from '../../Reducers/actionTypes'

export function UrlInput({ dispatchHandler, formState }) {
  return (
    <Grid item>
      <FormControl required fullWidth>
        <TextField
          name='url'
          label='URL'
          error={!validateUrl(formState.url) && formState.url !== ""}
          helperText={
            !validateUrl(formState.url) && formState.url !== ""
              ? "An invalid URL was provided - please check the input and try again."
              : null
          }
          onChange={(e) =>
            dispatchHandler({ type: SET_URL, value: e.currentTarget.value })
          }
          InputProps={{
            endAdornment:
              validateUrl(formState.url) && !formState.url !== "" ? (
                <InputAdornment position='end'>
                  {" "}
                  <CheckCircle color='success' />{" "}
                </InputAdornment>
              ) : null,
          }}
        />
      </FormControl>
    </Grid>
  )
}