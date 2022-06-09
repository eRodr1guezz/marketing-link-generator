import { useReducer, useEffect, useState } from "react";
import { urlBuildReducer, initialState } from "../../Reducers/urlBuildReducer";
import SimpleSnackbar from "../Snackbar/Snackbar";
import {
  Link,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import {
  HelpOutlineOutlined,
  AddCircleOutlineTwoTone,
} from "@mui/icons-material";
import useSnackbar from "../../Hooks/useSnackbar";
import { SET_ERROR, SET_MESSAGE } from "../../Reducers/actionTypes";
import { CampaignDrivers } from "../CampaignDrivers/CampaignDrivers";
import { BusinessUnitsSelect } from "../BusinessUnitsSelect/BusinessUnitsSelect";
import { TherapeuticAreasSelect } from "../TherapeuticAreasSelect/TherapeuticAreasSelect";
import { UrlInput } from "../UrlInput/UrlInput";
import { CampaignNameInput } from "../CampaignNameInput/CampaignNameInput";
import { CampaignCard } from "../CampaignCard/CampaignCard";
import styles from './form.module.css'
import HelpModal from "../HelpModal/HelpModal";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [increment, setIncrement] = useState(1);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();

  useEffect(() => {
    if (state.errors !== "") {
      openSnackBar(state.errors, "error");
    } else if (state.messages !== "") {
      openSnackBar(state.messages, "success");
    }
    return () => {
      dispatch({ type: SET_ERROR, value: "" });
      dispatch({ type: SET_MESSAGE, value: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.errors, state.messages]);

  return (
    <>
      {isOpen ? (
        <SimpleSnackbar type={alertType} message={message} isOpen={true} />
      ) : null}
      <Paper elevation={5}>
        <Container>
          <Grid className={styles.container}>

            <Box className={styles.flexAlign}>
              <Typography data-testid={"form-title"} component="h1" sx={{ fontWeight: 800 }} variant="h3">
                Campaign URL Builder
              </Typography>
              <HelpModal />
            </Box>

            <UrlInput dispatchHandler={dispatch} formState={state} />
            <CampaignNameInput formState={state} dispatchHandler={dispatch} />
            <BusinessUnitsSelect formState={state} dispatchHandler={dispatch} />
            <TherapeuticAreasSelect
              formState={state}
              dispatchHandler={dispatch}
            />
            {state.url !== '' &&
              <CampaignDrivers
                driverId={10000}
                formState={state}
                dispatchHandler={dispatch}
              />}

            {state.generatedDrivers &&
              state.generatedDrivers.map((d, i) => {
                return (
                  <CampaignDrivers
                    key={i}
                    driverId={parseInt(Object.keys(d)[0])}
                    dispatchHandler={dispatch}
                    formState={state}
                  />
                );
              })}

            <Box>
              <Button
                variant="text"
                size="medium"
                onClick={() => {
                  setIncrement(increment + 1);
                  let id = increment;
                  dispatch({ type: "ADD_NEW_DRIVER", driverId: id });
                }}
                endIcon={
                  <AddCircleOutlineTwoTone fontSize="small" color="primary" />
                }
              >
                Add Additional Driver?
              </Button>
            </Box>

            <Grid item>
              <Box sx={{ paddingTop: "1rem" }}>
                <Button
                  fullWidth
                  onClick={() => dispatch({ type: "GENERATE_URL_CAMPAIGN" })}
                  variant="contained"
                >
                  Generate URL Campaign
                </Button>
              </Box>
            </Grid>

            <Divider>
              <Typography variant="button" fontWeight={"bold"}>
                Results
              </Typography>
            </Divider>

            <Grid item>
              <Box sx={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                {state.campaignList && state.campaignList.length > 0 &&
                  state.campaignList.map(c => {
                    return (
                      <CampaignCard
                        id={c.id}
                        key={c.id}
                        subheader={'Created: ' + c.createdAt}
                        dispatchHandler={dispatch}
                        formState={state}
                        title={c.name}
                        urlList={c.urls}
                      />)
                  })}
              </Box>
            </Grid>

            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <HelpOutlineOutlined fontSize="small" color="secondary" />
                  <Link
                    underline="always"
                    variant="body2"
                    style={{ textAlign: "right", textDecoration: "none" }}
                    href="mailto:babruzese@medscapelive.com"
                  >
                    Issues with the URL builder? Get in touch!
                  </Link>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </>
  );
}
