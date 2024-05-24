const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const {describe, test, beforeEach, after} = require('node:test')
const blogHelper = require('./blog_list_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObj = new Blog(blogHelper.initialBlogs[0])
  await blogObj.save()
  blogObj = new Blog(blogHelper.initialBlogs[1])
  await blogObj.save()
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
    const newBlog = {
      title: "Nehal Test 3",
      author: "Nehal",
      url: "asd@asd.com",
      likes: 4
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogs = await blogHelper.blogsInDb()
    assert.strictEqual(newBlogs.length, blogHelper.initialBlogs.length + 1)

    const titles = newBlogs.map(b => b.title)
    assert(titles.includes("Nehal Test 3"))
  })

  test('Checking if likes, if missing, default to 0', async () => {
    const noLikesBlog = {
      title: "No Likes on This one",
      author: "Not important",
      url: "do-not-open.com"
    }

    await api
      .post('/api/blogs')
      .send(noLikesBlog)
    
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
      .expect(400)
    assert.strictEqual(res.body.Error, 'Bad Request')
  })
})
after(async () => await mongoose.connection.close())