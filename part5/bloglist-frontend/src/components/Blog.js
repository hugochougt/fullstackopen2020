import React from 'react'
import BlogDetails from './BlogDetails'
import Togglable from './Togglable'

const Blog = ({ blog, likeBlog, deleteBlog }) => (
  <div className="blog-item">
    <p className="title">{blog.title}</p>
    <p className="author">{ blog.author }</p>
    <Togglable buttonShowLabel='view' buttonHideLabel='hide'>
      <BlogDetails
        blog={blog}
        likeBlog={likeBlog}
      />
      <button onClick={deleteBlog}>remove</button>
    </Togglable>
  </div>
)

export default Blog
