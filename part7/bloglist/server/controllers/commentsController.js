const { ApplicationError } = require('@util/customErrors')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const create = async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    throw new ApplicationError('blog not found', 404)
  }

  const { body } = req.body
  const comment = new Comment({
    body,
    blog: blog._id,
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  res.send(savedComment.toJSON(), 201)
}

module.exports = {
  create,
}
