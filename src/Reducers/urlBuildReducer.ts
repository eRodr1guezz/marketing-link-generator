import { drivers } from "../internal";
import { v4 as uuidv4 } from "uuid";
import { UrlCampaign } from "../Entities/UrlCampaign";
import { InstanceUrl } from "../Entities/InstanceUrl";
import { URL } from "url";


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

interface InitialState {
  messages: string
  errors: string
  url: string
  bitlyAccessTokenField: string
  generatedDrivers: string[]
  selectedDrivers: boolean
  urlCollection: InstanceUrl[]
  campaignName: string,
  campaignLastGenerated: string,
  campaignList: UrlCampaign[],
  shortenedUrls: string[],
  driver?: string,
}

interface Action {
  param?: string
  paramType?: string
  type?: string
  value: string | string[]
  driverId?: number
  driver?: string
  driverType?: string
  campId?: string
}

export function urlBuildReducer(state: InitialState, action: Action ) {
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
    const url: URL = new URL(state.url);

    if (state.url === "") {
      return {
        ...state,
        errors:
          "Cannot generate a URL without a URL provided! Please provide a valid URL to proceed.",
      };
    }

    if (state.urlCollection.length > 0) {
      let updatedUrlCollection = state.urlCollection.map((url) => {
        const thisUrl = new URL(url)
        if (thisUrl.searchParams.has(`utm_${paramType}`)) {
          thisUrl.searchParams.delete(`utm_${paramType}`);
          thisUrl.searchParams.append(`utm_${paramType}`, param || '');

          return thisUrl;
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
      url.searchParams.append(`utm_${paramType}`, param || '');

      return {
        ...state,
        url: url.href,
      };
    } else {
      url.searchParams.append(`utm_${paramType}`, param || '');

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
    if(typeof action.value === 'string') {
      return {
        ...state,
        campaignName: decodeURI(action.value),
      };
    }
    
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
  } else if (action.type === "ADD_CHILD_URL_TO_CAMPAIGN") {
    const { value, driver } = action;
    let values;
    
    if(Array.isArray(value)) {
      values = value.map((val: string) => {
        return { param: val, driver };
      });
    }
    
    return {
      ...state,
      disabledFields: false,
      [driver || '']: values,
    };
  } else if (action.type === "ADD_NEW_DRIVER") {
    //convert to immer
    const { driverId } = action;
    let previous = state.generatedDrivers;
    let drivers = [];

    if (previous.length !== 0) {
      drivers.push(...previous, { [driverId || '']: { driverId } });
    } else {
      drivers.push({ [driverId || '']: { driverId } });
    }

    return {
      ...state,
      generatedDrivers: drivers,
    };
  } else if (action.type === "REMOVE_DRIVER") {
    const { driverId, driver } = action;
    const copy = { ...state }
    
    if(typeof driver === 'string') {
      delete copy[driver]
    }
    
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

    if(typeof driverType !== 'undefined') {
      return {
        ...state,
        urlCollection: state.urlCollection.filter(
          (url) => !url.href.includes(driverType)
        ),
      };
    }
    
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

    const generatedCampaign =
      state.campaignList.length > 0 ? [...state.campaignList] : [];
    
    interface CampaignDriver {
      param: string
    }

    const campaignDrivers: CampaignDriver[] = [];
    const campaignId = uuidv4();
    const createdAt = new Date().toTimeString();
    const rootUrl = state.url

    drivers.forEach((driver) => {
      if (state[driver.param] !== [] && state[driver.param] !== undefined)
        campaignDrivers.push(state[driver.param]);
    });

    const createdUrls = campaignDrivers
      .reduce((a, b) => a.concat(b))
      .map((u: InstanceUrl, i: number) => {
        const url = new InstanceUrl(rootUrl, i, u.driver);

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
    //TODO: I think this can be refactored to not exist..
    const { value } = action
    let copy = { ...state }
    
    if (value && typeof value === 'string') {
      delete copy[value + 'shortenedUrls']
    }

    return {
      ...copy
    }
  }
}

export { initialState };
