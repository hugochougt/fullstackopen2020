const { ApplicationError } = require('@util/customErrors')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const getAll = async (req, res) => {
  const users = await User.find({}).populate('blogs')
  res.send(users.map((u) => u.toJSON()))
}

const create = async (req, res) => {
  const { username, name, password } = req.body

  if (password === undefined) {
    throw new ApplicationError('`password` is required', 400)
  }

  if (password.length < 3) {
    const errorMsg = `User validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (3)`
    throw new ApplicationError(errorMsg, 400)
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.send(savedUser.toJSON())
}

const show = async (req, res) => {
  console.log(req.params.id)
  const user = await User.findById(req.params.id).populate('blogs')
  res.send(user.toJSON())
}

module.exports = {
  getAll,
  create,
  show,
}
