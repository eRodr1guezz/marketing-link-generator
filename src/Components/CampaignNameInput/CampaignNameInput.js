import { useState } from 'react'
import { Grid, FormControl, TextField } from '@mui/material';
import { APPEND_PARAM, SET_CAMPAIGN_NAME } from '../../Reducers/actionTypes';

export function CampaignNameInput({ formState, dispatchHandler }) {
  const [value, setValue] = useState('')

  return (
    <Grid item>
      <FormControl fullWidth>
        <TextField
          name='campaign_name'
          label='Campaign Name'
          value={value}
          disabled={formState.url === ''}
          helperText='We suggest using the full WorkFront project title, ie. 333713.01_LBU_MEDSSummer_Hybrid_07-22_CME'
          onChange={(e) => {
            setValue(e.currentTarget.value)
            dispatchHandler({
              type: APPEND_PARAM,
              paramType: "campaign",
              param: e.currentTarget.value.toLowerCase()
            });
            dispatchHandler({ type: SET_CAMPAIGN_NAME, value: e.currentTarget.value })
          }}
        />
      </FormControl>
    </Grid>
  )
}