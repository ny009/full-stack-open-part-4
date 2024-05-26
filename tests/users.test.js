const app = require('../app')
const User = require('../models/user')
const assert = require('node:assert')
const {describe, test, beforeEach, after} = require('node:test')
const userHelper = require('./test_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  let userObj = new User(userHelper.initialUsers[0])
  await userObj.save()
})

describe('Testing POST', () => {
  test('POST fails when user or password len is less than 0', async () => {
    const initialUsersInDb = await userHelper.usersInDb()
    const newUser = {
      username: 'Neh',
      name: 'Neh',
      password: 'Ne'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const finalUsersInDb = await userHelper.usersInDb()

    assert.strictEqual(initialUsersInDb.length, finalUsersInDb.length)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const initialUsersInDb = await userHelper.usersInDb()

    const newUser = {
      username: 'Nehal Test',
      name: 'Nehal',
      password: 'Nehal Test',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const finalUsersInDb = await userHelper.usersInDb()
    assert(result.body.error.includes('expected username to be unique'))

    assert.strictEqual(initialUsersInDb.length, finalUsersInDb.length)
  })
})

after(async () => await mongoose.connection.close())