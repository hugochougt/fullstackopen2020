import React from 'react'
import Person from './Person'

const Persons = ({ persons, handlePersonDelete }) => {
  return (
    <>
      {persons.map(person =>
        <Person key={person.id} person={person} handlePersonDelete={() => handlePersonDelete(person.id)} />
      )}
    </>
  )
}

export default Persons
