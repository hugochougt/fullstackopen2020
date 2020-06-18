import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ keyword, setKeyword] = useState('')

  const fetchPersons = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(fetchPersons, [])

  const handleFilterChange = (event) => {
    setKeyword(event.target.value)
  }

  const handleClick = (event) => {
    event.preventDefault()
    const sameNamePersons = persons.filter(person => person.name === newName)
    if (sameNamePersons.length > 0) {
      return alert(`${newName} is already added to numberbook`)
    }

    const newPerson = {
      name: newName, number: newNumber
    }
    setNewName('')
    setNewNumber('')
    setPersons(persons.concat(newPerson))
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlenumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = keyword === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(keyword))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handlenumberChange={handlenumberChange}
        handleClick={handleClick}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App