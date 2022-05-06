//TODO: convert all action types to SCREAMING_SNAKE_CASE
//TODO: decide if we need to keep or trash the classes
import { drivers } from "../internal";

const initialState = {
  messages: "",
  errors: "",
  url: "",
  disabledFields: true,
  bitlyUrlField: [],
  bitlyAccessTokenField: "",
  generatedDrivers: [],
  urlCollection: [],
  childUrls: [],
};

export class InstanceUrl extends URL {
  constructor(url, driverId, driver) {
    super(url);
    this.driverId = driverId;
    this.driver = driver;
  }
}

export function urlBuildReducer(state, action) {
  if (action.type === "REMOVE_PARAM") {
    const urlCopy = new URL(state.url);

    if (!urlCopy.searchParams.get("utm_" + action.paramType)) {
      return {
        ...state,
        errors: "Cannot remove a parameter that is not there!",
      };
    }

    urlCopy.searchParams.delete("utm_" + action.paramType);

    return {
      ...state,
      url: urlCopy.href,
    };
  } else if (action.type === "APPEND_PARAM") {
    const { paramType, param } = action;
    const urlCopy = new URL(state.url);

    if (state.url === "") {
      return {
        ...state,
        errors:
          "Cannot generate a URL without a URL provided! Please provide a valid URL in order to proceed.",
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

    if (urlCopy.searchParams.has(`utm_${paramType}`)) {
      urlCopy.searchParams.delete(`utm_${paramType}`);
      urlCopy.searchParams.append(`utm_${paramType}`, param);

      return {
        ...state,
        url: urlCopy.href,
      };
    } else {
      urlCopy.searchParams.append(`utm_${paramType}`, param);

      return {
        ...state,
        url: urlCopy.href,
      };
    }
  } else if (action.type === "SET_URL") {
    return {
      ...state,
      url: action.value,
    };
  } else if (action.type === "copyUrl") {
    console.log(action.value);
    if (state.url === "") {
      return {
        ...state,
        errors: "No URL provided! Please provide a URL and try again.",
      };
    } else {
      navigator.clipboard.writeText(action.value);
    }
    return {
      ...state,
      messages: "Successfully copied the URL to your clipboard!",
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
  } else if (action.type === "setBitlyAccessToken") {
    return {
      ...state,
      bitlyAccessTokenField: action.value,
    };
  } else if (action.type === "updateSelectedUrl") {
    const updatedUrl = new InstanceUrl(action.href, action.id);
    updatedUrl.searchParams.append("utm_id", action.value);

    let index = state.generatedUrls.findIndex(({ id }) => id === action.id);

    state.generatedUrls[index] = updatedUrl;

    return {
      ...state,
      generatedUrls: state.generatedUrls,
    };
  } else if (action.type === "ADD_CHILD_URL_TO_CAMPAIGN") {
    const { value, driver } = action; //the param

    let values = value.map((val) => { return { param: val, driver } })

    return {
      ...state,
      disabledFields: false,
      [driver]: values
    }
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

    return {
      ...state,
      [driver]: [],
      urlCollection: state.urlCollection !== [] && state.urlCollection.filter(u => u.driver !== driver),
      generatedDrivers: state.generatedDrivers.filter(
        (driver) => parseInt(Object.keys(driver)[0]) !== driverId
      ),
    };
  } else if (action.type === "REMOVE_URL") {
    const { driverType } = action;
    //this is removing urls by DRIVER TYPE - this may not always be the case? need to dive in a bit more here.
    return {
      ...state,
      urlCollection: state.urlCollection.filter(
        (url) => !url.href.includes(driverType)
      ),
    };
  } else if(action.type === "GENERATE_URL_CAMPAIGN") {
    //action generates a collection of URLs referred to as a "Campaign"
    let campaignDrivers = []

    drivers.forEach(driver => { 
      if(state[driver.param] !== [] && state[driver.param] !== undefined)
      campaignDrivers.push(state[driver.param])
    })

    let transformedToUrlList = campaignDrivers
      .reduce((a, b) => a.concat(b))
      .map(u => { 
        let url = new InstanceUrl(state.url, null, u.driver)
        url.searchParams.append('utm_medium', u.driver)
        url.searchParams.append('utm_driver_type', u.param)

        return url
      })
    
    return {
      ...state,
      messages: `${transformedToUrlList.length} URLs were successfully created!`,
      urlCollection: transformedToUrlList
    }
  } else if(action.type === 'SHORTEN_URLS') {
    const { value } = action

    console.log(value)
    
    return {
      ...state,
      urlCollection: value
    }
  } else if (action.type === 'SET_BITLY_ACCESS_TOKEN') {
    const { value } = action
    return {
      ...state,
      bitlyAccessTokenField: value,
    }
  }
}

export { initialState };
