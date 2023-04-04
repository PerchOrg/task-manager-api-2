const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { 
  userOneId, 
  userOne, 
  setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: "perch test",
    email: "perchtest@solvee.am",
    password: "123321qwetest",
    role: "admin",
    age: 18
  }).expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()
  expect(response.body).toMatchObject({
    user: {
      name: "perch test",
      email: "perchtest@solvee.am",
      role: "admin",
      age: 18,
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe("123321qwetest")
})

test('Should not create if user data is invalid', async () => {
  const userData = {};
  await request(app)
    .post('/users')
    .send(userData)
    .expect(400);
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'thisisnotmypass'
  }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should update valid user fields', async () => {
  await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
          name: 'Jess'
      })
      .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {
  await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
          location: 'Armenia'
      })
      .expect(400)
})