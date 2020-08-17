const jwt = require('jsonwebtoken')
const { ApplicationError } = require('@util/customErrors')
const Blog = require('../models/blog')
const User = require('../models/user')

const getAll = async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  res.send(blogs.map((blog) => blog.toJSON()))
}

const create = async (req, res) => {
  const { token } = req
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    throw new ApplicationError('token missing or invalid', 401)
  }

  const user = await User.findById(decodedToken.id)
  const {
    title, author, url, likes,
  } = req.body

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.send(savedBlog.toJSON(), 201)
}

const show = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('comments')
  if (blog) {
    res.send(blog.toJSON())
  } else {
    res.sendStatus(404)
  }
}

const update = async (req, res) => {
  const blog = { likes: req.body.likes }

  const updatedBlog = await Blog
    .findByIdAndUpdate(req.params.id, blog, { runValidator: true, context: 'query', new: true })

  res.send(updatedBlog.toJSON())
}

const destroy = async (req, res) => {
  const { token } = req
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    throw new ApplicationError('token missing or invalid', 401)
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(req.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await blog.remove()
    res.sendStatus(204)
  } else {
    throw new ApplicationError('deletion forbidden', 403)
  }
}

module.exports = {
  getAll,
  create,
  show,
  update,
  destroy,
}
