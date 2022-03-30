import { drivers, areas, businessUnits, therapeuticAreas } from '../internal'
import { validateUrl } from '../Utils';

const initialState = {
  url: '',
  isURLInvalid: false,
  disabledFields: true,
  drivers,
  businessUnits,
  areas,
  therapeuticAreas,
  customFieldSwitch: false,
  customParamField: '',
  customLabelField: '',
  businessUnitsField: '',
  campaignDriversField: '',
  therapeuticAreasField: '',
  therapeuticAreaSwitchField: false,
  vehicleTypesField: '',
  selectedTherapeuticAreaType: '',
  currentSelectedDriver: '',
  selectedDriverTypes: [],
  currentSelectedtherapeuticAreas: [],
  driverTypesFieldEnabled: true,
  bitlyUrlField: '',
  bitlyAccessTokenField: '',
  messages: '',
  errors: '',
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
  } else if (action.type === 'select') {
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
        currentSelectedDriver: driverData[0].driver,
        driverTypesVisibilty: driverData[0].type.length > 0 && driverData[0].type !== undefined,
        selectedDriverTypes: driverData[0].type //array of the drivers types
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
    if (state.url === '') {
      return {
        ...state,
        errors: 'No URL provided! Please provide a URL and try again.'
      }
    } else {
      navigator.clipboard.writeText(state.url)
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
  } else if (action.type === 'setBitlyURL') {
    if (state.bitlyAccessTokenField === '') {
      return {
        ...state,
        errors: 'Must provide an access token from your Bit.ly account.'
      }
    } else {
      return {
        ...state,
        bitlyUrlField: action.value,
        messages: 'Your shortened URL was successfully created with Bit.ly!'
      }
    }
  } else if (action.type === 'setBitlyAccessToken') {
    return {
      ...state,
      bitlyAccessTokenField: action.value
    }
  }
}

export { initialState }