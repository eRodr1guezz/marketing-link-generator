//TODO: continue to transfer all component level state OUT of the global and into respective components
//TODO: convert all action types to SCREAMING_SNAKE_CASE
//TODO: decide if we need to keep or trash the classes

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
  availableDriverTypes: [], //values are based on the currentSelectedDriver field (what displays as selectable to the user based on driver selection)
  bitlyFieldSwitch: false,
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
  } else if (action.type === "setBitlyURLs") {
    if (state.bitlyAccessTokenField === "") {
      return {
        ...state,
        errors: "Must provide an access token from your Bit.ly account.",
      };
    } else {
      return {
        ...state,
        bitlyUrlField: action.value,
        messages: "Your shortened URLs were successfully created with Bit.ly!",
      };
    }
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
    const { value, driverId, driver } = action; //the param
    const previousChildren = state.childUrls;
    let nextState = []

    let newUrls = value.map((val) => {
      const baseUrl = new InstanceUrl(state.url, driverId, driver);
      baseUrl.searchParams.append("utm_driver_type", val);
      baseUrl.searchParams.append("utm_driver", driver)
      
      return baseUrl;
    });

    if(previousChildren.length > 0) {
      nextState.push(...previousChildren, newUrls)

      return {
        ...state,
        childUrls: nextState
      }
    }
    return {
      ...state,
      childUrls: newUrls,
    };
  } else if (action.type === "ADD_NEW_DRIVER") {
    const { driverId } = action;
    let previous = state.generatedDrivers;
    let drivers = [];

    if (previous.length !== 0) {
      drivers.push(...previous, { [driverId]: { driverId, urls: [] } });
    } else {
      drivers.push({ [driverId]: { driverId, urls: [] } });
    }

    return {
      ...state,
      generatedDrivers: drivers,
    };
  } else if (action.type === "REMOVE_DRIVER") {
    const { driverId } = action;

    return {
      ...state,
      childUrls: state.childUrls.filter((url) => url.driverId !== driverId),
      generatedDrivers: state.generatedDrivers.filter(
        (driver) => parseInt(Object.keys(driver)[0]) !== driverId
      ),
    };
  } else if (action.type === "REMOVE_ALL_DRIVERS_BY_TYPE") {
    const { driverType } = action;
    const collection = state.urlCollection;

    return {
      ...state,
      urlCollection: collection.filter((url) => url.type !== driverType),
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
  }
}

export { initialState };
