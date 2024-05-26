const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config  = require('../utils/config')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, likes, url, userId } = request.body
  if (!title || !url) {
    return response.status(400).json({
      Error: 'Bad Request'
    })
  }

  const user = request.user

  if (user.id.toString() !== userId.toString()) {
    return response.status(401).json({ error: 'Mismatched token' })
  }
  const blog = new Blog({title, author, url, likes, user: userId})

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id',  middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (request.user.id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'Mismatched token' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const {author, url, likes} = request.body
  const person = {
    ...(likes && { likes }),
    ...(url && { url }),
    ...(author && { author }),
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, person, {new: true})
  response.json(result)
})

module.exports = blogsRouter