import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const SetAuthorBirthyearForm = ({ authors }) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')
  const [selected, setSelected] = useState(null)

  const [changeBirthyear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const options = authors.map((author) => ({ value: author.name, label: author.name }))

  const submit = (event) => {
    event.preventDefault()

    changeBirthyear({ variables: { name, born: parseInt(born) } })

    setSelected(null)
    setName(null)
    setBorn('')
  }

  const handleSelect = (selectedOption) => {
    setSelected(selectedOption)

    const { value } = selectedOption
    setName(value)
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <Select
          value={selected}
          options={options}
          onChange={handleSelect}
        />
        <div>
          born <input value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetAuthorBirthyearForm
