const jwt = require('jsonwebtoken')
const { ApplicationError } = require('@util/customErrors')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

const create = async (req, res) => {
  console.log('blogId', req.params.blogId)
  const { token } = req
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    throw new ApplicationError('token missing or invalid', 401)
  }

  // [Beware of Async/Await](https://www.brandonsmith.ninja/blog/async-await)
  const [user, blog] = await Promise.all([User.findById(decodedToken.id), Blog.findById(req.params.blogId)])
  console.log(user.toJSON())
  console.log(blog.toJSON())

  if (!blog) {
    throw new ApplicationError('blog not found', 404)
  }

  const { body } = req.body
  const comment = new Comment({
    body,
    user: user._id,
    blog: blog._id,
  })

  const savedComment = await comment.save()
  console.log(savedComment)
  user.comments = user.comments.concat(savedComment._id)
  blog.comments = blog.comments.concat(savedComment._id)

  await Promise.all([user.save(), blog.save()])

  res.send(savedComment.toJSON(), 201)
}

module.exports = {
  create,
}
