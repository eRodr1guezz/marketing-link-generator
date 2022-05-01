import {
  drivers,
} from "../internal";
import { validateUrl } from "../Utils";
import { v4 as uuidv4 } from "uuid";

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
  currentSelectedDriver: "",
  urlCollection: [],
  generatedUrls: [],
  driverTypeUrls: [],
  availableDriverTypes: [], //values are based on the currentSelectedDriver field (what displays as selectable to the user based on driver selection)
  bitlyFieldSwitch: false,
};

export class InstanceUrl extends URL {
  constructor(url, id) {
    super(url);
    this.id = id;
  }
}

class UrlList {
  constructor(campaignId, urls) {
    this.campaignId = campaignId;
    this.urls = urls;
  }

  add(url) {
    this.urls.forEach(({ href, id }) => {
      if (href === url.href || id === url.id) {
        throw new Error(`${href} already exists.`)
      } else {
        this.urls.push(url)
      }
    })
  }
}

class Campaign {
  constructor(id, name, rootUrl, businessUnit, businessUnitSubCat, urlList, drivers, created) {
    this.id = id
    this.name = name
    this.rootUrl = rootUrl
    this.created = created
    this.businessUnit = businessUnit
    this.businessUnitSubCat = businessUnitSubCat
    this.urlList = urlList
    this.drivers = drivers
  }

  addDriver(driver) {

  }

}

class Driver { //every driver generates a new url for each type
  constructor(name, types, params, param, campaignId) {
    this.campaignId = campaignId
    this.types = types
    this.name = name
    this.param = param
    this.params = params
  }
}

const createdDriversFromUI = [{ //comes from the UI form
  name: 'soc',
  types: [
    { param: 'twi', params: [{ label: 'post_type', param: 'poll' }, { label: '' }] }
  ],
  customParams: [{ label: 'id', param: '1' }, { label: 'post_type', param: 'poll' }]
},
{
  name: 'em',
  types: ['int'],
  customParams: [{ label: 'date', param: 113022 }]
}
]

//for every driver, make a new url for each type that contains 

//i need a url that contains the root_campaign_url + driver=social + type=twi + id=twi_ad_1 + post_type=poll

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

    if (state.url === '') {
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
      url: action.value
    }
  } else if (action.type === "setField") {
    const { fieldName, value, fieldId } = action;
    if (fieldId) {
      return {
        ...state,
        [fieldId + '-campaignDriverField']: value,
        availableDriverTypes: drivers.filter(driver => driver.param === value)[0].type
      }
    } else {
      return {
        ...state,
        [fieldName + "Field"]: value,
      };
    }
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
  } else if (action.type === "clearField") {
    let url = new URL(state.url);

    url.searchParams.delete("utm_" + action.fieldName);

    return {
      ...state,
      [action.fieldName + "Field"]: "",
      url: url.href,
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
  } else if (action.type === "SET_AVAILABLE_DRIVER_TYPES") {
    return {
      ...state,
      availableDriverTypes: action.value[0].type,
    };
  } else if (action.type === "generateSingleUrl") {
    const url = new InstanceUrl(state.url, uuidv4());
    const prev = state.generatedUrls;

    return {
      ...state,
      generatedUrls: prev.concat(url),
    };
  } else if (action.type === "updateSelectedUrl") {
    const updatedUrl = new InstanceUrl(action.href, action.id);
    updatedUrl.searchParams.append("utm_id", action.value);

    let index = state.generatedUrls.findIndex(({ id }) => id === action.id)

    state.generatedUrls[index] = updatedUrl

    return {
      ...state,
      generatedUrls: state.generatedUrls
    };
  } else if (action.type === 'generateDriverComponent') {
    const { fieldId, values } = action
    return {
      ...state,
      [fieldId + 'driverField']: values
    }
  } else if (action.type === 'ADD_URL') {
    let nextState = state.urlCollection
    //adding a url should check for dupes BEFORE creation!!
    state.urlCollection.forEach(url => {
      if (url.href === action.value.href) {
        //this is where you left off *****
      }
    })

    nextState.push(action.value)

    return {
      ...state,
      urlCollection: nextState
    }
  } else if (action.type === 'removeUrls') {
    //this is technically remove ALL URLS
    return {
      ...state,
      urlCollection: []
    }
  } else if (action.type === 'addDrivers') {
    //this is adding drivers by the driver type but we dont need to do that we just need to create a general driver [] and add to that
    const { driverType } = action
    if (!drivers) {
      return
    } else {
      let drivers = []
      drivers.push(driverType)

      return {
        ...state,
        [driverType]: drivers
      }
    }
  } else if (action.type === 'REMOVE_ALL_DRIVERS_BY_TYPE') {
    const { driverType } = action
    const collection = state.urlCollection

    return {
      ...state,
      urlCollection: collection.filter(url => url.type !== driverType)
    }
  } else if (action.type === 'REMOVE_URL') {
    const { driverType } = action
    //this is removing urls by DRIVER TYPE - this may not always be the case? need to dive in a bit more here.
    return {
      ...state,
      urlCollection: state.urlCollection.filter(url => !url.href.includes(driverType))
    }
  }
}

export { initialState };
