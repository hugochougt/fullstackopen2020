const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const contentTypeKey = 'Content-Type'
const contentTypeRegex = /application\/json/

let token = null

beforeAll(async () => {
  await User.deleteMany({})
  const user = helper.initialUsers[0]
  await api
    .post('/api/users')
    .send(user)

  const response = await api
    .post('/api/tokens')
    .send(user)

  token = response.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const user = (await helper.usersInDb())[0]

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user.id })
    await blogObject.save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect(contentTypeKey, contentTypeRegex)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is winthin the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('First class tests')
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(returnedBlog => {
      expect(returnedBlog.id).toBeDefined()
      expect(returnedBlog._id).toBeUndefined()
    })
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: "Type wars copy",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(contentTypeKey, contentTypeRegex)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(newBlog.title)
  })

  test('fails with status 400 if data invalid', async () => {
    const newBlog = {
      author: 'no name'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('succeeds with likes property default to be 0 when missing from request', async () => {
    const newBlogWithoutLikes = {
      title: "Type wars copy",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    }

    let response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .set('Authorization', `Bearer ${token}`)

    let returnedBlog = response.body
    expect(returnedBlog.likes).toEqual(0)

    const newBlogWithLikes = Object.assign({}, newBlogWithoutLikes, { likes: 11 })
    response = await api
      .post('/api/blogs')
      .send(newBlogWithLikes)
      .set('Authorization', `Bearer ${token}`)

    returnedBlog = response.body
    expect(returnedBlog.likes).toEqual(newBlogWithLikes.likes)
  })

  test('fails with status code 401 if token not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: "Type wars copy",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect(contentTypeKey, contentTypeRegex)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect(contentTypeKey, contentTypeRegex)

    expect(resultBlog.body.id.toString()).toEqual(blogToView.id.toString())
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '0'
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('update likes of a blog', () => {
  test('succeeds setting new likes count', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikesCount = 99999

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikesCount })
      .expect(200)

    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`)
    expect(updatedBlog.body.likes).toEqual(newLikesCount)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
