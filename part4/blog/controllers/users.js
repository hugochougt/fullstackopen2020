const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs')
  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (password === undefined) {
    return res.status(400).json({ error: '`password` is required' })
  }

  if (password.length < 3) {
    const errorMsg = `User validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (3)`
    return res.status(400).json({ error: errorMsg })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.json(savedUser.toJSON())
})

module.exports = usersRouter
