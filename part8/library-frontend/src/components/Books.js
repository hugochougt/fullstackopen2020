import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import GenreTab from './GenreTab'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (result.loading) {
      return
    }

    if (genre) {
      setBooks(result.data.allBooks.filter((book) => book.genres && book.genres.includes(genre)))
    } else {
      setBooks(result.data.allBooks)
    }
  }, [genre, result])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      { genre && <p>in genre <strong>{genre}</strong></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
            <th>
              genres
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              <td>{a.genres && a.genres.join(' ')}</td>
            </tr>
          )}
        </tbody>
      </table>

      <GenreTab
        genres={Array.from(new Set(result.data.allBooks.map((book) => book.genres).flat()))}
        setGenre={setGenre}
        currentGenre={genre}
      />
    </div>
  )
}

export default Books
