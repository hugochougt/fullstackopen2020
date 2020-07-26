import React from 'react'
import BlogDetails from './BlogDetails'
import Togglable from './Togglable'

const Blog = ({ blog, user, likeBlog, deleteBlog }) => (
  <div className="blog-item">
    <p className="title">{blog.title}</p>
    <p className="author">{ blog.author }</p>
    <Togglable buttonShowLabel='view' buttonHideLabel='hide'>
      <BlogDetails
        blog={blog}
        likeBlog={likeBlog}
      />
      { user.id === blog.user.id ? <button className='remove-btn' onClick={deleteBlog}>remove</button> : null }
    </Togglable>
  </div>
)

export default Blog
