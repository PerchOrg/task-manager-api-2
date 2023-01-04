const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Session = require('../../src/models/session')
const Booking = require('../../src/models/booking')
const Hall = require('../../src/models/hall')
const Movie = require('../../src/models/movie')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: "perch",
  email: "perch@solvee.am",
  password: "123321qwe",
  role: "admin",
  age: 18,
  tokens: [{
    token: jwt.sign({_id: userOneId, role: "admin"}, process.env.JWT_SECRET)
  }]
}

const hallOneId = new mongoose.Types.ObjectId()
const hallOne = {
    _id: hallOneId,
    hallNumber: 2,
    column: 10,
    row: 10,
}

const movieOneId = new mongoose.Types.ObjectId()
const movieOne = {
    _id: movieOneId,
    filmName: "Mko",
    genre: "true",
    ageLimit: 12,
}

const sessionOneId = new mongoose.Types.ObjectId()
const sessionOne = {
    _id: sessionOneId,
    date: "12/12/1212",
    movie: movieOneId,
    hall: hallOneId,
}

const bookingOneId = new mongoose.Types.ObjectId()
const bookingOne = {
    _id: bookingOneId,
    seatNumber: 12,
    owner: userOneId,
    session: sessionOneId,
}

const setupDatabase = async() => {
    await User.deleteMany()
    await Booking.deleteMany()
    await Hall.deleteMany()
    await Movie.deleteMany()
    await Session.deleteMany()
    await new User(userOne).save()
}

const setupBookingDatabase = async () => {
    const movie = await new Movie(movieOne)
    const hall = await new Hall(hallOne)
    const session = new Session(sessionOne)

    movie.save()
    hall.save()
    session.save()
}

const setupSessionDatabase = async () => {
    const movie = await new Movie(movieOne)
    const hall = await new Hall(hallOne)
    movie.save()
    hall.save()
}

module.exports = {
    userOneId,
    userOne,
    hallOneId,
    hallOne,
    movieOneId,
    movieOne,
    sessionOneId,
    sessionOne,
    bookingOneId,
    bookingOne,
    setupDatabase,
    setupBookingDatabase,
    setupSessionDatabase
}