const request = require('supertest');
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/user')
const { 
  sessionOneId, 
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  bookingOne,
  bookingTwo,
  bookingThree,
  setupBookingDatabase, 
  setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    const user = await User.findById(userOneId)
    const userObject = user.toObject()

    delete userObject.tokens;
    delete userObject.password;

    expect(res.body).toMatchObject(userObject)
  });


  it('should return a 401 if no JWT is provided', async () => {
    const res = await request(app)
      .get('/users/me')
      .expect(401);

    expect(res.body).toMatchObject({ error: 'Please authenticate' });
  });

  it('should return a 401 if the JWT is invalid', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(res.body).toMatchObject({ error: 'Please authenticate' });
  });

  it('should return a 401 if the JWT is expired', async () => {
    const expiredToken = jwt.sign({_id: userOneId, role: "admin"}, process.env.JWT_SECRET, { expiresIn: '-10s' })
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(res.body).toMatchObject({ error: 'Please authenticate' });
  });

  it('should return a 401 if user does not have permission', async () => {
    const expiredToken = jwt.sign({_id: userOneId, role: "wrong role"}, process.env.JWT_SECRET)
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(res.body).toMatchObject({ error: 'Please authenticate' });
  });
});
