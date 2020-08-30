import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendatoryBooks from './components/RecommendatoryBooks'
import { useQuery, useLazyQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS, ME, FILTER_BOOKS_BY_GENRE, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [currentUser, setCurrentUser] = useState({})
  const me = useQuery(ME)
  const [filterBooks, result] = useLazyQuery(FILTER_BOOKS_BY_GENRE)
  const [recommendatoryBooks, setRecommendatoryBooks] = useState([])
  const client = useApolloClient()

  useEffect(() => {
    const localToken = localStorage.getItem('library-user-token')
    if (localToken) {
      setToken(localToken)
    }

    if (!me.loading) {
      setCurrentUser(me.data.me)
    }

    if (result.data) {
      setRecommendatoryBooks(result.data.allBooks)
    }
  }, [me, result])

  const logout = () => {
    setToken(null)
    setPage('authors')
    localStorage.clear()
    client.resetStore()
  }

  const updateCacheWith = (addedBook) => {
    const { author } = addedBook
    const includedIn = (set, object) => set.map((item) => item.id).includes(object.id)

    const booksInStore = client.readQuery({ query: ALL_BOOKS })

    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: booksInStore.allBooks.concat(addedBook) },
      })
    }

    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(authorsInStore.allAuthors, author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: authorsInStore.allAuthors.concat(author) },
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const handleRecommenddationClick = () => {
    setPage('recommend')
    filterBooks({ variables: { genre: currentUser.favoriteGenre }})
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors
          show={page === 'authors'}
        />

        <Books
          show={page === 'books'}
        />

        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setPage={setPage}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => handleRecommenddationClick()}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors
        show={page === 'authors'}
        logined={token !== null}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        updateCacheWith={updateCacheWith}
      />

      <RecommendatoryBooks
        show={page === 'recommend'}
        currentUser={currentUser}
        books={recommendatoryBooks}
      />
    </div>
  )
}

export default App
