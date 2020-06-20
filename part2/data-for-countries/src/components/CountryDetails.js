import React from 'react'

const CountryDetails = ({ country }) => {
  if (Object.keys(country).length === 0 && country.constructor === Object) {
    return null
  }

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>Languages</h2>
      <ul>
        {country.languages.map(lang =>
          <li key={lang.iso639_2}>{lang.name}</li>
        )}
      </ul>
      <div>
        <img src={country.flag} alt={`flag of ${country.name}`} />
      </div>
    </div>
  )
}

export default CountryDetails
