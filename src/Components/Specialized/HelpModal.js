import { useState } from "react";
import {
  Box,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { HelpCenterRounded } from "@mui/icons-material";

export default function HelpModal({ dispatchHandler, formState }) {
  const [open, setOpen] = useState(false);
  const [value,] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (value) {
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <HelpCenterRounded fontSize={'large'} color="warning" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: 'bolder' }}>Welcome to the Campaign URL Builder!</DialogTitle>
        <DialogContent>
          <Box>
            <p>
              The purpose of this URL generator tool is to help you quickly and
              easily create trackable URLs for your project that utilize the
              organizations unique marketing parameters.
            </p>
            <p>
              If you ever run into a bug/issue with the builder, please feel
              free to reach out to me directly any time at: <a href="mailto:babruzese@medscapelive.com">babruzese@medscapelive.com</a>! You can also send me a DM on Slack!
            </p>
            <p>
              All you'll need to get started with the builder is a base URL!
              <br /><br />
              <span style={{ fontStyle: 'italic' }}>ex. https://www.atest.com</span>
            </p>

            <p>This will be the URL of the website you are using in your project. After
              that, you'll simply select what areas of the Business this will be
              for - ie. MedscapeLive or Medscape etc.</p>

            <p>Upon selecting that Business unit, another dropdown will emerge with a selection of Business Unit
              Subcategories. This will allow you to further dial into the unique
              area of the organization your project lives.</p>

            <p>There is also a Therapeutic Area dropdown that can be toggled on or off if necessary
              - this will allow you to choose the Therapeutic area of the project,
              ie. Derm. </p>

            <p>At this point, the project has generated a "Root URL"
              under the hood. That Root URL will be the new basis for all the
              generated URLs you create when adding Campaign Drivers!</p>

            <p>A "Driver"
              is the unique method you're using in your marketing campaign - for
              example, Email or Social Media. After a driver is created, the tool
              will also allow you to generate URLs for individual platforms, ie.
              Facebook or Twitter for Social Media, or define whether an Email is
              internal or external etc.</p>

            <Typography component={'p'} variant="body2">Note: You can add as many drivers as you'd
              like as long as you do not duplicate them!</Typography>

            <p>Once you've chosen your
              drivers, you can click "Generate URL Campaign" to create your unique
              collection of URLs! This will display right on the bottom of the
              form under "Results". You are also given the option of exporting the
              created campaign to a CSV file that can be opened in your favorite text
              editor or spreadsheet software, ie. Microsoft Excel/Apple Numbers!
              You may also notice that there's a feature that allows you to
              shorten your URLs with Bit.ly!</p>

            <p>Once you've generated your campaign,
              simply click the button that says "Shorten ALL URLs". This will shorten all the URLs in your campaign instantly!
              *Please be advised that this is currently backed by a demo Bitly account and there may be limited URLs for use.
              to view/copy!</p> I'm very excited to share this project with you! If you have any feedback or concerns don't
            hesitate to ask, I'd love to know what you think! Thank you!!
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}
