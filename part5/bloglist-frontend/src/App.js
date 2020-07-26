import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import tokenService from './services/tokens.js'

import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await tokenService.create({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Logged in')
      setMsgType('success')
    } catch (exception) {
      setMessage(exception.response.data.error)
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem('loggedUser')

    setMessage('Logged out')
    setMsgType('success')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setMsgType('success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage(exception.response.data.error)
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async id => {
    const blog = blogs.find(blog => blog.id === id)
    const newLikes = blog.likes + 1
    const returnedBlog = await blogService.update(id, { likes: newLikes })

    setBlogs(blogs.map(blog => blog.id !== id ? blog : {...returnedBlog, likes: newLikes }))
  }

  const deleteBlog = async id => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      await blogService.destroy(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonShowLabel='add blog' buttonHideLabel='cancel' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <Notification message={message} type={msgType} />
        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-btn">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} type={msgType} />

      <p>{user.username} logged in. <button onClick={handleLogout}>logout</button></p>

      { blogForm() }

      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          likeBlog={() => likeBlog(blog.id)}
          deleteBlog={() => deleteBlog(blog.id)}
        />
      )}
    </div>
  )
}

export default App
