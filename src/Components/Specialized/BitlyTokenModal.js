import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BitlyIcon } from '../../bitlyIcon';
import { InputAdornment } from '@mui/material';

export default function BitlyTokenModal({ dispatchHandler, formState }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (value) {
      dispatchHandler({ type: 'SET_BITLY_ACCESS_TOKEN', value })
      dispatchHandler({ type: 'SET_MESSAGE', value: 'Bit.ly Access Token was successfully set!' })
      setOpen(false);
    } else {
      dispatchHandler({ type: 'SET_ERROR', value: 'No Access Token was set.' })
      setOpen(false)
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} fullWidth>
        Set your bit.ly access token
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set Your Bitly Access Token</DialogTitle>
        <DialogContent>
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position='end'><BitlyIcon color='info' /></InputAdornment>
            }}
            onChange={e => setValue(e.currentTarget.value)}
            autoFocus
            margin="dense"
            id="bitlyAccessToken"
            label="Bit.ly Access Token"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Set Token</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
