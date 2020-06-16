import React from 'react'

const PersonForm = (props) => {
  return (
    <form>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>number: <input value={props.newNumber} onChange={props.handlenumberChange} /></div>
      <div>
        <button type="submit" onClick={props.handleClick}>add</button>
      </div>
    </form>
  )
}

export default PersonForm
