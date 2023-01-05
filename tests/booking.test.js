const request = require('supertest')
const app = require('../src/app')
const Booking = require('../src/models/booking')
const User = require('../src/models/user')
const { 
  sessionOneId, 
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  userThreeId,
  userThree,
  bookingOne,
  movieOneId,
  movieOne,
  bookingTwo,
  bookingThree,
  setupBookingDatabase, 
  setupDatabase 
} = require('./fixtures/db')

beforeEach( async () => {
    await setupDatabase()
    await setupBookingDatabase()
})

test('Should create booking for user', async () => {
  expect(userOne.age).toBeGreaterThan(movieOne.ageLimit)
  const response = await request(app)
    .post('/bookings')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        seatNumber: 12,
        session: sessionOneId
    })
    .expect(201)

    const booking = await Booking.findById(response.body._id)
    expect(booking).not.toBeNull()

    expect(response.body).toMatchObject({
      seatNumber: 12,
      session: sessionOneId
    })
})

test('Should not create booking for unauthenticated user', async () => {
  expect(userOne.age).toBeGreaterThan(movieOne.ageLimit)
  await request(app)
    .post('/bookings')
    .send()
    .expect(401)
})

test('Should not create booking if is user`s age is not matching to film requirements', async () => {
    expect(userThree.age).toBeLessThan(movieOne.ageLimit)
    request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
      .send({
          seatNumber: 12,
          session: sessionOneId
      })
      .expect(403)
  })

test('Should fetch user bookings', async () => {
    const response = await request(app)
      .get('/bookings')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not get bookings for unauthenticated user', async () => {
    await request(app)
    .get('/bookings')
    .send()
    .expect(401)
})

test('Should delete other user bookings', async () => {
    request(app)
    .delete(`/bookings/${bookingOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const booking = await Booking.findById(bookingOne._id)
  expect(booking).not.toBeNull()
})


test('Should not delete other user bookings', async () => {
    request(app)
    .delete(`/bookings/${bookingOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  const booking = await Booking.findById(bookingOne._id)
  expect(booking).not.toBeNull()
})

test('Should not delete bookings for unauthenticated user', async () => {
    request(app)
    .delete(`/bookings/${bookingOne._id}`)
    .send()
    .expect(401)
})

test('Should update valid booking fields', async () => {
  await request(app)
      .patch(`/bookings/${bookingOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
          seatNumber: 1
      })
      .expect(200)
  const booking = await Booking.findById(bookingOne._id)
  expect(booking.seatNumber).toEqual(1)
})

test('Should not update other user bookings', async () => {
    request(app)
    .patch(`/bookings/${bookingOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  const booking = await Booking.findById(bookingOne._id)
  expect(booking).not.toBeNull()
})

test('Should not update invalid booking fields', async () => {
  await request(app)
      .patch(`/bookings/${bookingOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'Armenia'
      })
      .expect(400)
})