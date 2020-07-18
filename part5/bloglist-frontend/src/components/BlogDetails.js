import React, { useState } from 'react'
import blogService from '../services/blogs'

const BlogDetails = (props) => {
  const [blog, setBlog] = useState(props.blog)

  const handleLike = async blog => {
    const newLikes = blog.likes + 1
    await blogService.update(blog.id, { likes: newLikes })

    setBlog(Object.assign({}, blog, { likes: newLikes }))
  }

  return (
    <>
      <p>{ blog.url }</p>
      <p>likes: { blog.likes } <button onClick={() => handleLike(blog)}>like</button></p>
      <p>{ blog.author }</p>
    </>
  )
}

export default BlogDetails
