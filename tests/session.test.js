const request = require('supertest')
const app = require('../src/app')
const Session = require('../src/models/session')
const { 
  movieOneId, 
  hallOneId, 
  userOne,
  userThree,
  setupDatabase, 
  setupSessionDatabase 
} = require('./fixtures/db')


beforeEach( async () => {
    await setupDatabase()
    await setupSessionDatabase()
})

test('Should create session for user', async () => {
  const response = await request(app)
    .post('/session')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        date: "12/12/1212",
        movie: movieOneId,
        hall: hallOneId
    })
    .expect(201)

    const session = await Session.findById(response.body._id)
    expect(session).not.toBeNull()

    expect(response.body).toMatchObject({
      date: "12/12/1212",
      movie: movieOneId,
      hall: hallOneId
    })
})

test('Should not create if session data is invalid', async () => {
  const sessionData = {};
  await request(app)
    .post('/session')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(sessionData)
    .expect(400);
});

test('Should not create session for unauthenticated user', async () => {
  await request(app)
    .post('/session')
    .send()
    .expect(401)
})

test('Should not create session if user does not have admin permission', async () => {
  request(app)
    .post('/session')
    .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(401)
})