import React from 'react'

const GenreTab = ({ genres, setGenre, currentGenre }) => {
  const handleClick = (event) => {
    const clickedGenre = event.target.innerHTML

    if (clickedGenre === currentGenre) {
      setGenre(null)
    } else {
      setGenre(clickedGenre)
    }
  }

  return (
    genres.map((genre) => {
      return <button onClick={handleClick} key={genre}>{genre}</button>
    })
  )
}

export default GenreTab
