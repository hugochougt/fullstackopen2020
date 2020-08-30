import React from 'react'

const RecommendatoryBooks = ({ currentUser, books, show }) => {
  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{ currentUser && currentUser.favoriteGenre }</strong></p>

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
    </div>
  )
}

export default RecommendatoryBooks
