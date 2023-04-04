const request = require('supertest')
const app = require('../src/app')
const Movie = require('../src/models/movie')
const {
  userOne, 
  userThree,
  setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a new movie', async () => {
  const movieData = {
    filmName: 'Test Movie',
    genre: 'horror',
    ageLimit: 12,
    poster: 'img.png',
  };

  const response = await request(app)
    .post('/movie')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .field('filmName', movieData.filmName)
    .field('genre', movieData.genre)
    .field('ageLimit', movieData.ageLimit)
    .attach('poster', './tests/fixtures/img.png')
    .expect(201);

  const movie = await Movie.findById(response.body._id);
  expect(movie).not.toBeNull();
  expect(movie.filmName).toBe(movieData.filmName);
  expect(movie.ageLimit).toBe(movieData.ageLimit);
  expect(movie.genre).toBe(movieData.genre);
});

test('Should not create a new movie if poster img exstension is invalid', async () => {
  const movieData = {
    filmName: 'Test Movie',
    genre: 'horror',
    ageLimit: 12,
  };

  await request(app)
    .post('/movie')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .field('filmName', movieData.filmName)
    .field('genre', movieData.genre)
    .field('ageLimit', movieData.ageLimit)
    .attach('poster', './tests/fixtures/img.svg')
    .expect(400)
    .expect({ error: 'please upload an image' });
});

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

test('Should not create movie if user does not have admin permission', async () => {
  request(app)
    .post('/movie')
    .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(401)
})