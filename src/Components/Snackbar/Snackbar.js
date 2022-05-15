import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';

export default function SimpleSnackbar({ isOpen, message, type }) {
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      {isOpen ? <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        action={action}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
      >
        <Alert
          severity={type}
        >
          {message}
        </Alert>
      </Snackbar> : null}
    </div>
  );
}