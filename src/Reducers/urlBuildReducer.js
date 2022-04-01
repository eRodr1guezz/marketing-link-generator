import { drivers, areas, businessUnits, therapeuticAreas } from '../internal'
import { validateUrl } from '../Utils';

//business units
//drivers
//driver types
//therapeutic areas

//any state denoted as "Field" refers to the forms field state value
//any state denoted as itself, ie. drivers, business units etc are application Entities
//any state denoted 

const initialState = {
  //top level form state
  messages: '',
  errors: '',
  url: '',
  isURLInvalid: false,
  disabledFields: true,
  //entities - right now this state is internally stored, however, there may be a point where it becomes available from another source. keeping this accessible and isolated will be important.
  drivers,
  businessUnits,
  areas,
  therapeuticAreas,
  //internal controlled form state - ie. form fields, inputs etc.
  bitlyUrlField: [],
  bitlyAccessTokenField: '',
  //form input values
  businessUnitsField: '',
  campaignDriversField: '',
  therapeuticAreasField: '',
  //selected entities
  currentSelectedDriver: '',
  selectedTherapeuticAreaType: '',
  currentSelectedtherapeuticAreas: [], //this should be a string
  selectedDriverTypes: [], //this is the array of selected driver types - the population of this array should render additional URLs (1 per driver type))
  driverTypesField: [], //this is the form state value (what is shown as the current value in the chip box)
  availableDriverTypes: [], //values are based on the currentSelectedDriver field (what displays as selectable to the user based on driver selection)
  urlsByDriverType: [],
  therapeuticAreaSwitchField: false,
  driverTypesFieldEnabled: true, //this can probably go
  //this field grouping will enable custom entries to be added (ie, details for campaigns such as the type of social post (poll, video, text, img etc.))
  customFieldSwitch: false,
  customParamField: '',
  customLabelField: '',
  listOfUrlsToBeShortened: []
}

export function urlBuildReducer(state, action) {
  if (action.type === 'removeParam') {
    const urlCopy = new URL(state.url)

    if (!urlCopy.searchParams.get('utm_' + action.paramType)) {
      return {
        ...state,
        errors: 'Cannot remove a parameter that is not there!'
      }
    }

    urlCopy.searchParams.delete('utm_' + action.paramType)

    return {
      ...state,
      url: urlCopy.href
    }
  } else if (action.type === 'appendParam') {
    if (state.url.length === 0) {
      return {
        ...state,
        errors: 'Cannot generate a URL without a URL provided! Please provide a valid URL in order to proceed.'
      }
    }

    const { paramType, param } = action
    const urlCopy = new URL(state.url)

    if (urlCopy.searchParams.has(`utm_${paramType}`)) {
      urlCopy.searchParams.delete(`utm_${paramType}`)
      urlCopy.searchParams.append(`utm_${paramType}`, param)

      return {
        ...state,
        url: urlCopy.href
      }
    } else {
      urlCopy.searchParams.append(`utm_${paramType}`, param)

      return {
        ...state,
        url: urlCopy.href,
      }
    }

  } else if (action.type === 'setUrl') {
    if (validateUrl(action.value)) {
      return {
        ...state,
        isURLInvalid: false,
        disabledFields: false,
        url: action.value,
        errors: ''
      }
    } else {
      return {
        ...state,
        url: action.value,
        isURLInvalid: true,
        disabledFields: true,
        errors: 'An invalid URL was provided - please try again.'
      }
    }

  } else if (action.type === 'setField') {
    const { fieldName, value } = action

    return {
      ...state,
      [fieldName + 'Field']: value
    }
  } else if (action.type === 'selectDriver') {
    const { fieldType } = action

    if (!state.url) {
      return {
        ...state,
        errors: 'URL cannot be empty when selecting a campaign driver! Please provide a URL and try again.'
      }
    } else {

      const urlCopy = new URL(state.url)
      urlCopy.searchParams.delete('utm_vehicleType') //when we select a new driver, we delete any old associated types from the url

      const driverData = state.drivers.filter(d => d.driver === fieldType)

      return {
        ...state,
        url: urlCopy.href,
        selectedDriverTypes: [],
        urlsByDriverType: [],
        currentSelectedDriver: driverData[0].driver,
        driverTypesVisibilty: driverData[0].type.length > 0 && driverData[0].type !== undefined,
        availableDriverTypes: driverData[0].type //array of the drivers types
      }
    }
  } else if (action.type === 'getEntity') {
    const { param, entity } = action

    const url = new URL(state.url)
    url.searchParams.delete(`utm_${entity}`) //when we select a new entity, we delete any old associated types from the url

    const data = state[entity].filter(el => el.param === param)

    return {
      ...state,
      url: url.href, //update the url
      [`currentSelected${entity}`]: data,
      // driverTypesVisibilty: data[0].type.length > 0 && data[0].type !== undefined,
      // selectedTherapeuticAreaType: data[0].type
    }
  } else if (action.type === 'copyUrl') {
    console.log(action.value)
    if (state.url === '') {
      return {
        ...state,
        errors: 'No URL provided! Please provide a URL and try again.'
      }
    } else {
      navigator.clipboard.writeText(action.value)
    }
    return {
      ...state,
      messages: 'Successfully copied the URL to your clipboard!'
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      errors: action.value
    }
  } else if (action.type === 'toggleTherapeuticAreaSwitch') {
    if (state.url === '') {
      return {
        ...state,
        errors: 'Please provide a URL before enabling the Therapeutic Area dropdown.'
      }
    } else {
      let url = new URL(state.url)

      url.searchParams.delete('utm_therapeuticArea')

      if (state.therapeuticAreaSwitchField === false) {
        return {
          ...state,
          url: url.href,
          therapeuticAreaSwitchField: true
        }
      } else {
        return {
          ...state,
          url: url.href,
          therapeuticAreaSwitchField: false
        }
      }
    }

  } else if (action.type === 'clearField') {
    let url = new URL(state.url)

    url.searchParams.delete('utm_' + action.fieldName)

    return {
      ...state,
      [action.fieldName + 'Field']: '',
      url: url.href
    }
  } else if (action.type === 'message') {
    return {
      ...state,
      messages: action.value
    }
  } else if (action.type === 'setBitlyURLs') {
    if (state.bitlyAccessTokenField === '') {
      return {
        ...state,
        errors: 'Must provide an access token from your Bit.ly account.'
      }
    } else {
      console.log(action.value)
      return {
        ...state,
        bitlyUrlField: action.value,
        messages: 'Your shortened URLs were successfully created with Bit.ly!'
      }
    }
  } else if (action.type === 'setBitlyAccessToken') {
    return {
      ...state,
      bitlyAccessTokenField: action.value
    }
  } else if (action.type === 'addDriverType') {
    //multiple driver types can be selected - adding multiple driver types will render additional urls - 1 URL per driver type (ie. one twitter, one linkedin, one facebook etc)
    return {
      ...state,
      selectedDriverTypes: action.value
    }
  } else if (action.type === 'renderUrlsByDriverType') {
    // make this return an array that contains the constructed URLs 
    const urlsByDriverTypes = state.selectedDriverTypes.map((param) => {
      let url = new URL(state.url)

      if (url.searchParams.get('utm_driverTypes')) {
        url.searchParams.delete('utm_driverTypes')
        url.searchParams.append('utm_driverTypes', param)
      }

      return url.href
    })

    return {
      ...state,
      urlsByDriverType: urlsByDriverTypes
    }
  } else if (action.type === 'setAvailableDriverTypes') {
    return {
      ...state,
      availableDriverTypes: action.value[0].type
    }
  }
}

export { initialState }