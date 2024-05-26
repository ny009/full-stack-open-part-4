const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.get('/', async (req, res) => {
  const result = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 } )
  res.status(200).json(result)
})

userRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body
  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least of length 3'})
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = userRouter