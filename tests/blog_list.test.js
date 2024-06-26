const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('node:assert')
const {describe, test, beforeEach, after} = require('node:test')
const blogHelper = require('./test_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const api = supertest(app)
let token
beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'nehal', name: 'nehal', passwordHash})
  await user.save()

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})
  const blogObjs = blogHelper.initialBlogs.map(blog => new Blog({...blog, user: user.id}))
  const promiseArr = blogObjs.map(b => b.save())
  await Promise.all(promiseArr)
})

describe('Testing GET', () => {
  test('Checking response are returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  })

  test('Checking if GET returns right length', async () => {
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, blogHelper.initialBlogs.length)
  })

  test ('Checking if the unique identifier is name "id"', async () => {
    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body[0].hasOwnProperty('id'), true)
    assert.strictEqual(res.body[0].hasOwnProperty('_id'), false)
  })
})

describe('Testing POST', () => {
  test('Checking if a POST request creates a new blog post', async () => {
    const userId = jwt.verify(token, process.env.SECRET).id
    const newBlog = {
      title: "Nehal Test 3",
      author: "Nehal",
      url: "asd@asd.com",
      likes: 4,
      userId,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogs = await blogHelper.blogsInDb()
    assert.strictEqual(newBlogs.length, blogHelper.initialBlogs.length + 1)

    const titles = newBlogs.map(b => b.title)
    assert(titles.includes("Nehal Test 3"))
  })
  test('POST fails with 401 if token is not correct', async () => {
    const newBlog = {
      title: "Nehal Test 3",
      author: "Nehal",
      url: "asd@asd.com",
      likes: 4,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('Checking if likes, if missing, default to 0', async () => {
    const userId = jwt.verify(token, process.env.SECRET).id
    const noLikesBlog = {
      title: "No Likes on This one",
      author: "Not important",
      url: "do-not-open.com",
      userId,
    }

    await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .set('Authorization', `Bearer ${token}`)
    
    const newBlogs = await blogHelper.blogsInDb()
    const noLikesInDb = newBlogs.find(blog => blog.title === "No Likes on This one")
    assert.strictEqual(noLikesInDb.hasOwnProperty('likes'), true)
    assert.strictEqual(noLikesInDb.likes, 0)
  })

  test ('Check if title or url are missing, we get a 400', async () => {
    const noTitleBlog = {
      author: "No author",
      url: "do-not-open.com"
    }

    const res = await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    assert.strictEqual(res.body.Error, 'Bad Request')
  })
})

describe('Testing Delete', () => {
  test ('Succeeds with a 204 if valid', async () => {
    const blogs = await blogHelper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    
    const blogsAfter = await blogHelper.blogsInDb()
    assert.strictEqual(blogsAfter.length, blogHelper.initialBlogs.length - 1)

    const blogTitles = blogsAfter.map(blog => blog.title)
    assert(!blogTitles.includes(blogToDelete.title))
  })
  test('DELETE fails with 401 if token is not correct', async () => {
    const blogs = await blogHelper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
})

describe('Testing PUT', () => {
  test ('Succeeds with 200 OK if valid and matches new number of likes', async () => {
    const blogs = await blogHelper.blogsInDb()
    const blogToUpdate = blogs[0]

    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send({likes : 100})
      .expect(200)

    const blogsAfter = await blogHelper.blogsInDb()
    assert.strictEqual(blogsAfter[0].likes, 100)
  })
})
after(async () => await mongoose.connection.close())