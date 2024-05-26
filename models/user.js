const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    required: true,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      ref: 'Blog',
      type: mongoose.Schema.Types.ObjectId,
    }
  ]
})

userSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
    delete retObj.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)