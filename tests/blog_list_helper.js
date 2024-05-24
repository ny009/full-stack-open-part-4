const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Nehal Test 1",
    author: "Nehal",
    url: "asd.com",
    likes: 1
  },
  {
    title: "Nehal test 2",
    author: "Nehal",
    url: "asd123.com",
    likes: 5
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
module.exports = {
  initialBlogs,
  blogsInDb,
}