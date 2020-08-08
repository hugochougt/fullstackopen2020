const SET_ACTION = 'SET_NOTIFICATION'
const RESET = 'RESET'

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case SET_ACTION:
      return action.notification
    case RESET:
      return null
    default:
      return state
  }
}

export const setNotification = (content, seconds) => {
  return dispatch => {
    dispatch({
      type: SET_ACTION,
      notification: content
    })

    setTimeout(() => {
      dispatch(resetNotification())
    }, seconds * 1000)
  }
}

const resetNotification = () => {
  return {
    type: RESET
  }
}

export default notificationReducer
