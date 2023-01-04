const express = require('express');
const router = new express.Router();
const Session = require('../models/session')
const Movie = require('../models/movie')
const Hall = require('../models/hall')
const auth = require('../middleware/auth')

router.post('/session', (req, res, next) => auth(req, res, next, 'admin'), async (req, res) => {
    const session = new Session(req.body)
    const movie = await Movie.findById(req.body.movie)
    const hall = await Hall.findById(req.body.hall)
    if(!movie) {
      return res.status(400).send({ error: `No such movie` })
    }
    if(!hall) {
      return res.status(400).send({ error: `No such hall` })
    }
    try {
        await session.save()
        res.status(201).send(session)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;