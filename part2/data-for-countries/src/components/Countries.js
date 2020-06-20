import React from 'react'
import SimpleCountries from './SimpleCountries'
import CountryDetails from './CountryDetails'

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return <SimpleCountries countries={countries} />
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return null
}

export default Countries
