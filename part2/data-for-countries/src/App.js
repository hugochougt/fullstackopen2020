import React, { useState } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ keyword, setKeyword ] = useState('')

  const handleInputChange = (event) => {
    const name = event.target.value

    setKeyword(name)
    if (name) {
      axios
      .get(`https://restcountries.eu/rest/v2/name/${name}`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        setCountries([])
      })
    } else {
      setCountries([])
    }
  }

  return (
    <div>
      <div>
        find countries <input value={keyword} onChange={handleInputChange} />
      </div>
      <Countries countries={countries} />
    </div>
  )
}

export default App;
