import React from 'react'

const BlogDetails = ({ blog, likeBlog }) => {
  return (
    <>
      <p className="url">{ blog.url }</p>
      <p className="likes">likes: { blog.likes } <button className="like-btn" onClick={likeBlog}>like</button></p>
    </>
  )
}

export default BlogDetails
