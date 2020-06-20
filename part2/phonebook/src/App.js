import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personSerice from './services/persons'

import './index.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ keyword, setKeyword] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ msgType, setMsgType ] = useState(null)

  const fetchPersons = () => {
    personSerice
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }

  useEffect(fetchPersons, [])

  const handleFilterChange = (event) => {
    setKeyword(event.target.value)
  }

  const handleClick = (event) => {
    event.preventDefault()
    const sameNamePerson = persons.find(person => person.name === newName)
    const newPerson = {
      name: newName, number: newNumber
    }

    if (sameNamePerson
      && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      personSerice
        .update(sameNamePerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
        })
        .catch(error => {
          setMessage(`Information of ${newName} has already been removed from server`)
          setMsgType('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)

          setPersons(persons.filter(p => p.id !== sameNamePerson.id))
        })
    } else {
      personSerice
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      setMessage(`Added ${newName}`)
      setMsgType('success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonDelete = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personSerice
        .destroy(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(
            `the person '${person.name}' was already deleted from server`
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = keyword === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(keyword))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={msgType} />
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleClick={handleClick}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}

export default App
