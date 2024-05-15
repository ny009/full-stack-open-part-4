const logger = require('./logger')

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

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'Malformatted Id'})
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler
}