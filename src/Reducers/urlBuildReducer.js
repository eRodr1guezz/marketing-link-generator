import { drivers } from "../internal";
import { v4 as uuidv4 } from "uuid";
import { UrlCampaign } from "../Entities/UrlCampaign";
import { InstanceUrl } from "../Entities/InstanceUrl";

const initialState = {
  messages: "",
  errors: "",
  url: "",
  bitlyAccessTokenField: "",
  generatedDrivers: [],
  selectedDrivers: false,
  urlCollection: [],
  campaignName: "",
  campaignLastGenerated: null,
  campaignList: [],
  shortenedUrls: [],
};

export function urlBuildReducer(state, action) {
  if (action.type === "REMOVE_PARAM") {
    const url = new URL(state.url);

    if (!url.searchParams.get("utm_" + action.paramType)) {
      return {
        ...state,
        errors: "Cannot remove a parameter that is not there.",
      };
    }

    url.searchParams.delete("utm_" + action.paramType);

    return {
      ...state,
      url: url.href,
    };
  } else if (action.type === "APPEND_PARAM") {
    const { paramType, param } = action;
    const url = new URL(state.url);

    if (state.url === "") {
      return {
        ...state,
        errors:
          "Cannot generate a URL without a URL provided! Please provide a valid URL to proceed.",
      };
    }

    if (state.urlCollection.length > 0) {
      let updatedUrlCollection = state.urlCollection.map((url) => {
        if (url.searchParams.has(`utm_${paramType}`)) {
          url.searchParams.delete(`utm_${paramType}`);
          url.searchParams.append(`utm_${paramType}`, param);

          return url;
        } else {
          return null;
        }
      });
      return {
        ...state,
        urlCollection: updatedUrlCollection,
      };
    }

    if (url.searchParams.has(`utm_${paramType}`)) {
      url.searchParams.delete(`utm_${paramType}`);
      url.searchParams.append(`utm_${paramType}`, param);

      return {
        ...state,
        url: url.href,
      };
    } else {
      url.searchParams.append(`utm_${paramType}`, param);

      return {
        ...state,
        url: url.href,
      };
    }
  } else if (action.type === "SET_URL") {
    return {
      ...state,
      url: action.value,
    };
  } else if (action.type === "SET_CAMPAIGN_NAME") {
    return {
      ...state,
      campaignName: decodeURI(action.value),
    };
  } else if (action.type === "SET_ERROR") {
    return {
      ...state,
      errors: action.value,
    };
  } else if (action.type === "SET_MESSAGE") {
    return {
      ...state,
      messages: action.value,
    };
  } else if (action.type === "UPDATE_SELECTED_URL") {
    const updatedUrl = new InstanceUrl(action.href, action.id);
    updatedUrl.searchParams.append("utm_id", action.value);

    let index = state.generatedUrls.findIndex(({ id }) => id === action.id);

    state.generatedUrls[index] = updatedUrl;

    return {
      ...state,
      generatedUrls: state.generatedUrls,
    };
  } else if (action.type === "ADD_CHILD_URL_TO_CAMPAIGN") {
    const { value, driver } = action;

    let values = value.map((val) => {
      return { param: val, driver };
    });

    return {
      ...state,
      disabledFields: false,
      [driver]: values,
    };
  } else if (action.type === "ADD_NEW_DRIVER") {
    const { driverId } = action;
    let previous = state.generatedDrivers;
    let drivers = [];

    if (previous.length !== 0) {
      drivers.push(...previous, { [driverId]: { driverId } });
    } else {
      drivers.push({ [driverId]: { driverId } });
    }

    return {
      ...state,
      generatedDrivers: drivers,
    };
  } else if (action.type === "REMOVE_DRIVER") {
    const { driverId, driver } = action;

    let copy = state

    delete copy[driver]

    return {
      ...copy,
      urlCollection:
        state.urlCollection !== [] &&
        state.urlCollection.filter((u) => u.driver !== driver),
      generatedDrivers: state.generatedDrivers.filter(
        (driver) => parseInt(Object.keys(driver)[0]) !== driverId
      ),
    };
  } else if (action.type === "REMOVE_URL") {
    const { driverType } = action;

    return {
      ...state,
      urlCollection: state.urlCollection.filter(
        (url) => !url.href.includes(driverType)
      ),
    };
  } else if (action.type === "GENERATE_URL_CAMPAIGN") {
    if (state.campaignList.some(c => c.name === state.campaignName)) {
      return {
        ...state,
        errors: 'You have already created a campaign with that name. Try providing a different campaign name.'
      }
    }

    if (!state.selectedDrivers) {
      return {
        ...state,
        errors: 'You must select at least one Campaign Driver before generating a Campaign!'
      }
    }

    let generatedCampaign =
      state.campaignList.length > 0 ? [...state.campaignList] : [];
    let campaignDrivers = [];
    let campaignId = uuidv4();
    let createdAt = new Date().toTimeString();
    let rootUrl = state.url

    drivers.forEach((driver) => {
      if (state[driver.param] !== [] && state[driver.param] !== undefined)
        campaignDrivers.push(state[driver.param]);
    });

    let createdUrls = campaignDrivers
      .reduce((a, b) => a.concat(b))
      .map((u) => {
        let url = new InstanceUrl(rootUrl, null, u.driver);

        url.searchParams.append("utm_medium", u.driver);
        url.searchParams.append("utm_driver_type", u.param);

        return url;
      });

    generatedCampaign.push(
      new UrlCampaign(
        campaignId,
        decodeURI(state.campaignName),
        createdUrls,
        createdAt,
        []
      ));

    return {
      ...state,
      messages: `${createdUrls.length} URLs were successfully created for campaign ${decodeURI(state.campaignName)}!`,
      urlCollection: [],
      campaignLastGenerated:
        state.campaignList.length > 0
          ? state.campaignList[state.campaignList.length - 1].createdAt
          : { id: campaignId, generatedAt: createdAt },
      campaignList: generatedCampaign,
    };
  } else if (action.type === "DELETE_CAMPAIGN") {
    const { value } = action
    return {
      ...state,
      messages: 'Campaign successfully removed!',
      campaignList: state.campaignList.filter(c => c.id !== value)
    }
  } else if (action.type === "SHORTEN_URLS") {
    const { value, campId } = action;

    return {
      ...state,
      messages: `You have successfully shortened ${value.length} URLs!`,
      [campId + 'shortenedUrls']: value,
    };
  } else if (action.type === "SET_BITLY_ACCESS_TOKEN") {
    const { value } = action;
    return {
      ...state,
      bitlyAccessTokenField: value,
    };
  } else if (action.type === 'SET_DRIVER') {
    return {
      ...state,
      selectedDrivers: action.value
    }
  } else if (action.type === 'REMOVE_CAMPAIGN_CLEANUP') {
    const { value } = action
    let copy = state
    if (value) {
      delete copy[value + 'shortenedUrls']
    }

    return {
      ...copy
    }
  }
}

export { initialState };