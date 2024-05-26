const jwt = require('jsonwebtoken')
const logger = require('./logger')
const config = require('./config')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path:   ', req.path)
  logger.info('Body:   ', req.body)
  logger.info('---')
  next()
}

const unknownEndPoint = (req, res) => {
  res.status(404).send({error: 'Unknown Endpoint'})
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'Malformatted Id'})
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected username to be unique' })
  }
  if (error.name === 'JsonWebTokenError' && error.message.includes('jwt must be provided')) {
    return res.status(401).json({ error: 'Token not provided' })
  }
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const auth = req.headers.authorization
  if (auth && auth.includes('Bearer ')) {
    req.token = auth.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedId = jwt.verify(req.token, config.SECRET).id
  if (!decodedId) {
    res.status(401).json({ error: 'Token Missing' })
  }
  try {
    const tokenUser = await User.findById(decodedId)
    req.user = tokenUser
  } catch (err) {
    res.status(404).json( {error: 'User not found'} )
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}