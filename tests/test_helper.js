const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'Nehal Test',
    password: 'Nehal Test',
    name: 'Nehal'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
}