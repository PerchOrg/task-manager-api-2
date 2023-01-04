const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const sessionRouter = require('./routers/session')
const movieRouter = require('./routers/movie')
const bookingRouter = require('./routers/booking')
const hallRouter = require('./routers/hall')

const app = express();

app.use(express.json());
app.use(userRouter)
app.use(sessionRouter)
app.use(movieRouter)
app.use(bookingRouter)
app.use(hallRouter)

module.exports = app;