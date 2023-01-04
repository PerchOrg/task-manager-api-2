const request = require('supertest')
const app = require('../src/app')
const Hall = require('../src/models/hall')
const {
  userOne, 
  setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create hall for user', async () => {
  const response = await request(app)
    .post('/hall')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        hallNumber: 2,
        column: 10,
        row: 10
    })
    .expect(201)

    const hall = await Hall.findById(response.body._id)
    expect(hall).not.toBeNull()
})