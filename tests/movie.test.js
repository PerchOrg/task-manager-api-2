const request = require('supertest')
const app = require('../src/app')
const Movie = require('../src/models/movie')
const {
  userOne, 
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