const SET_ACTION = 'SET_NOTIFICATION'
const RESET = 'RESET'

const notificationReducer = (state = { content: null, lastTimeoutId: null }, action) => {
  switch (action.type) {
    case SET_ACTION:
      if (typeof state.lastTimeoutId === 'number') {
        clearTimeout(state.lastTimeoutId)
      }

      return {
        content: action.content,
        lastTimeoutId: action.lastTimeoutId
      }
    case RESET:
      return {}
    default:
      return state
  }
}

export const setNotification = (content, seconds) => {
  return dispatch => {
    const timeoutId = setTimeout(() => {
      dispatch(resetNotification())
    }, seconds * 1000)

    dispatch({
      type: SET_ACTION,
      content: content,
      lastTimeoutId: timeoutId
    })
  }
}

const resetNotification = () => {
  return {
    type: RESET
  }
}

export default notificationReducer
