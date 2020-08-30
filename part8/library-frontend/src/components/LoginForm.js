import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, show, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setPage('authors')
    },
    onError: (error) => {
      console.error(error)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  if (!show) {
    return null
  }

  return (
    <form onSubmit={submit}>
      <div>
        username <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm
