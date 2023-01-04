const request = require('supertest')
const app = require('../src/app')
const Booking = require('../src/models/booking')
const { 
  sessionOneId, 
  userOne, 
  setupBookingDatabase, 
  setupDatabase 
} = require('./fixtures/db')

beforeEach( async () => {
    await setupDatabase()
    await setupBookingDatabase()
})

test('Should create booking for user', async () => {

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