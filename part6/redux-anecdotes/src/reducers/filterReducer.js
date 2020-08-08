const SET_ACTION = 'SET_FILTER'
const RESET = 'RESET'
const filterReducer = (state = null, action) => {
  switch (action.type) {
    case SET_ACTION:
      return action.filter
    case RESET:
      return null
    default:
      return state
  }
}

export const filterChange = filter => {
  return {
    type: SET_ACTION,
    filter,
  }
}

export default filterReducer
