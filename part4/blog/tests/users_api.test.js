const helper = require('./test_helper')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when thers is initially users in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10)
      let userObject = new User({
        ...user, passwordHash
      })
      await userObject.save()
    }
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'zhaqiang',
      name: 'zhaqiang Zhou',
      password: 'pwd233'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: helper.initialUsers[0].username,
      name: 'Superuser',
      password: 'pwd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username or password not present', async () => {
    const usersAtStart = await helper.usersInDb()
    const name = 'Superuser'

    const newUserWithoutUsername = {
      name,
      password: 'pwd'
    }

    const result1 = await api
      .post('/api/users')
      .send(newUserWithoutUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('`username` is required')

    const newUserWithoutPassword = {
      name,
      username: 'new user'
    }

    const result2 = await api
      .post('/api/users')
      .send(newUserWithoutPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('`password` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username or password less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWith2CharsUsername = {
      name: 'Superuser',
      username: 'un',
      password: 'pwd'
    }

    const result1 = await api
      .post('/api/users')
      .send(newUserWith2CharsUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('`username` (`un`) is shorter than the minimum allowed length (3)')

    const newUserWith2CharsPassword = {
      name: 'Superuser',
      username: 'new un',
      password: 'pw'
    }

    const result2 = await api
      .post('/api/users')
      .send(newUserWith2CharsPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain(`\`password\` (\`${newUserWith2CharsPassword.password}\`) is shorter than the minimum allowed length (3)`)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

