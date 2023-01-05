const request = require('supertest')
const app = require('../src/app')
const Movie = require('../src/models/movie')
const {
  userOne, 
  userThree,
  setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create movie for user', async () => {
  const response = await request(app)
    .post('/movie')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        filmName: "Mko",
        genre: true,
        ageLimit: 12
    })
    .expect(201)

    const movie = await Movie.findById(response.body._id)
    expect(movie).not.toBeNull()
})

test('Should not create if movie data is invalid', async () => {
  const movieData = {};
  await request(app)
    .post('/movie')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(movieData)
    .expect(400);
});

test('Should not create movie for unauthenticated user', async () => {
  await request(app)
    .post('/movie')
    .send()
    .expect(401)
})

test('Should not create movie if user does not have permission', async () => {
  request(app)
    .post('/movie')
    .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(401)
})