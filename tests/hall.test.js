const request = require('supertest')
const app = require('../src/app')
const Hall = require('../src/models/hall')
const {
  userOne, 
  setupDatabase,
  userThree
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

test('Should not create if hall data is invalid', async () => {
  const hallData = {};
  await request(app)
    .post('/hall')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(hallData)
    .expect(400);
});

test('Should not create hall for unauthenticated user', async () => {
    await request(app)
      .post('/hall')
      .send()
      .expect(401)
  })

test('Should not create hall if user does not have permission', async () => {
  request(app)
    .post('/hall')
    .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(401)
})