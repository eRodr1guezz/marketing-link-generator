import { drivers, businessUnitSubCategories, businessUnits, therapeuticAreas } from '../internal'
import { validateUrl } from '../Utils';

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
  businessUnitSubCategories,
  therapeuticAreas,
  //internal controlled form state - ie. form fields, inputs etc.
  bitlyUrlField: [],
  bitlyAccessTokenField: '',
  //form input values
  businessUnitsField: [],
  businessUnitSubCategoriesField: [],
  campaignDriversField: '',
  therapeuticAreasField: '',
  //selected entities
  currentSelectedDriver: '',
  urlCollection: [],
  selectedTherapeuticAreaType: '',
  currentSelectedtherapeuticAreas: [], //this should be a string
  selectedDriverTypes: [], //this is the array of selected driver types - the population of this array should render additional URLs (1 per driver type))
  driverTypesField: [], //this is the form state value (what is shown as the current value in the chip box)
  availableDriverTypes: [], //values are based on the currentSelectedDriver field (what displays as selectable to the user based on driver selection)
  urlsByDriverType: [],
  therapeuticAreaFieldSwitch: false,
  //this field grouping will enable custom entries to be added (ie, details for campaigns such as the type of social post (poll, video, text, img etc.))
  bitlyFieldSwitch: false,
  customFieldSwitch: false,
  customParamField: '',
  customLabelField: '',
  test: 0,
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
    const { paramType, param } = action
    const urlCopy = new URL(state.url)

    if (state.url.length === 0) {
      return {
        ...state,
        errors: 'Cannot generate a URL without a URL provided! Please provide a valid URL in order to proceed.'
      }
    }

    if (state.urlCollection.length > 0) {
      let updatedUrlCollection = state.urlCollection.map(url => {
        if (url.searchParams.has(`utm_${paramType}`)) {
          url.searchParams.delete(`utm_${paramType}`)
          url.searchParams.append(`utm_${paramType}`, param)

          return url
        } else {
          return null
        }
      })
      return {
        ...state,
        urlCollection: updatedUrlCollection
      }
    }

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
        disabledFields: false,
        url: action.value,
        errors: ''
      }
    } else {
      return {
        ...state,
        url: action.value,
        disabledFields: true,
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
      urlCopy.searchParams.delete('utm_driver_type') //when we select a new driver, we delete any old associated types from the url

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
  } else if (action.type === 'toggleFieldSwitch') {
    const { fieldType, param } = action

    let url = new URL(state.url)

    url.searchParams.delete(param)

    if (state[`${fieldType}FieldSwitch`] === false) {
      return {
        ...state,
        url: url.href,
        [fieldType + 'FieldSwitch']: true
      }
    } else {
      return {
        ...state,
        url: url.href,
        [fieldType + 'FieldSwitch']: false
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
    //this should not render urls BY driver type - it needs to render urls from the global url state, and take into account each driver type, rendering a url from the root url for each driver type
    // make this return an array that contains the constructed URLs 
    //what if we add a param AFTER the url has been generated? should we keep track of when urls are generated and then how many 
    const urlsByDriverTypes = state.selectedDriverTypes.map((param) => {
      let url = new URL(state.url)

      if (url.searchParams.get('utm_driver_type')) {
        url.searchParams.delete('utm_driver_type')
        url.searchParams.append('utm_driver_type', param)
      }

      return { fullUrl: url.href, bitlyUrl: '' }
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
  } else if (action.type === 'renderUrls') {
    //set a count equal to the amount of selected driver types
    if (state.selectedDriverTypes.length > 0) {
      if (state.bitlyFieldSwitch) {
        let urlCollection = state.selectedDriverTypes.map(type => {
          let rootUrlInstance = new URL(state.url)

          rootUrlInstance.searchParams.append('utm_driver_type', type)

          return rootUrlInstance
        })
        return {
          ...state,
          urlCollection,
        }
      } else {
        return {
          ...state,
          errors: 'nothing happened'
        }
      }
    }
  }
}

export { initialState }