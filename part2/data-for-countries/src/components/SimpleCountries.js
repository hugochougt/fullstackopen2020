import React, { useState } from 'react'
import axios from 'axios'
import CountryDetails from './CountryDetails'

const SimpleCountries = ({ countries }) => {
  const [ showingCounty, setShowingCountry ] = useState({})

  const handleShowClick = name => {
    axios
      .get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
      .then(response => {
        const returnedCountry = response.data[0]
        setShowingCountry(returnedCountry)
      })
  }

  return (
    <>
      {countries.map(coutry =>
        <div key={coutry.numericCode}>
          {coutry.name} <button onClick={() => handleShowClick(coutry.name)}>show</button>
        </div>
      )}
      <CountryDetails country={showingCounty} />
    </>
  )
}

export default SimpleCountries
