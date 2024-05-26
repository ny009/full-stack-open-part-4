const express = require('express')
const cors = require('cors')
require('express-async-errors')

const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')

const mongoose = require('mongoose')

mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('Successfully connected to MONGO DB'))
  .catch(err => logger.error('Error connecting to MONGO DB', err))

const app = express()
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app