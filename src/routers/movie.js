const express = require('express');
const router = new express.Router();
const Movie = require('../models/movie')
const auth = require('../middleware/auth')

router.post('/movie', (req, res, next) => auth(req, res, next, 'admin'), async (req, res) => {
    const movie = new Movie(req.body)

    try {
        await movie.save()
        res.status(201).send(movie)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;