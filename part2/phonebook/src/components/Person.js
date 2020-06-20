import React from 'react'

const Person = ({ person, handlePersonDelete }) => {
  return (
    <p>{person.name} {person.number} <button onClick={handlePersonDelete}>delete</button></p>
  )
}

export default Person
