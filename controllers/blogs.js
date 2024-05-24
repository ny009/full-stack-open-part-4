const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  if (!title || !url) {
    return response.status(400).json({
      Error: 'Bad Request'
    })
  }

  const blog = new Blog(request.body)

  const result = await blog.save()
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