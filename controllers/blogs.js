const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config  = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, likes, url, userId } = request.body
  if (!title || !url) {
    return response.status(400).json({
      Error: 'Bad Request'
    })
  }

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Invalid Token' })
  }
  const  user = await User.findById(decodedToken.id)

  const blog = new Blog({title, author, url, likes, user: userId})

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
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