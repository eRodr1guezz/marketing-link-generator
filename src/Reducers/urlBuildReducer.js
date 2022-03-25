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
  businessUnitsField: '',
  name: '',
  campaignDriversField: '',
  therapeuticAreasField: '',
  selectedTherapeuticAreaType: '',
  currentSelectedtherapeuticAreas: [],
  vehicleTypesField: '',
  currentSelectedDriver: '',
  selectedDriverTypes: [],
  driverTypesVisibilty: false,
  driverTypesFieldEnabled: true,
  errors: [],
}

export function urlBuildReducer(state, action) {
  if (action.type === 'removeParam') {
    const urlCopy = new URL(state.url)

    if (!urlCopy.searchParams.get('utm_' + action.paramType)) {
      return {
        ...state,
        errors: [{ type: 'url', msg: 'Cannot remove a parameter that is not there!' }]
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
        errors: [{ type: 'url', msg: 'Cannot generate a URL without a URL provided! Please provide a valid URL in order to proceed.' }]
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
        url: urlCopy.href
      }
    }

  } else if (action.type === 'url') {
    if (!validateUrl(action.value)) {
      return {
        ...state,
        isURLInvalid: true,
        disabledFields: true,
        errors: [{ type: 'url', msg: 'An invalid URL was provided - please try again.' }]
      }
    } else {
      return {
        ...state,
        isURLInvalid: false,
        disabledFields: false,
        url: action.value,
        errors: []
      }
    }

  } else if (action.type === 'setField') {
    const { fieldName, value } = action

    return {
      ...state,
      [fieldName + 'Field']: value
    }

  } else if (action.type === 'setBusinessUnitsField') {
    return {
      ...state,
      businessUnitsField: action.value
    }
  } else if (action.type === 'setVehicleClasses') {
    return {
      ...state,
      vehicleClasses: action.value
    }
  } else if (action.type === 'setVehicleClassField') {
    return {
      ...state,
      vehicleClassField: action.value
    }
  } else if (action.type === 'setVehicleTypes') {
    return {
      ...state,
      vehicleTypes: action.value
    }
  } else if (action.type === 'setVehicleTypesField') {
    return {
      ...state,
      vehicleTypesField: action.value
    }
  } else if (action.type === 'setEmail') {
    const urlCopy = new URL(state.url)

    urlCopy.searchParams.append('utm_campaignSource', action.value)

    return {
      ...state,
      url: urlCopy.href
    }
  } else if (action.type === 'select') {
    const { fieldType } = action

    if (!state.url) {
      return {
        ...state,
        errors: [{ type: 'url', msg: 'URL cannot be empty when selecting a campaign driver! Please provide a URL and try again.' }]
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

  }
}

export { initialState }