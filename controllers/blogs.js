const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url, userId } = request.body

  const  user = await User.findById(userId)

  if (!title || !url) {
    return response.status(400).json({
      Error: 'Bad Request'
    })
  }

  const blog = new Blog({title, url, user: userId})

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