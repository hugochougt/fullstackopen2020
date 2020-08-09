import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (props.content) {
    return (
      <div style={style}>
        {props.content}
      </div>
    )
  }

  return null
}

const mapStateToProps = state => {
  const { notification: { content, lastTimeoutId } } = state

  return {
    content,
    lastTimeoutId
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification
