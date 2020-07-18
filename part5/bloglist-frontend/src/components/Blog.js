import React from 'react'
import BlogDetails from './BlogDetails'
import Togglable from './Togglable'

const Blog = ({ blog }) => (
  <div className="blog-item">
    {blog.title}
    <Togglable buttonShowLabel='view' buttonHideLabel='hide'>
      <BlogDetails blog={blog} />
    </Togglable>
  </div>
)

export default Blog
