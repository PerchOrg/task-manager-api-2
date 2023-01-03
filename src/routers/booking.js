const express = require('express');
const router = new express.Router();
const Booking = require('../models/booking')
const Movie = require('../models/movie')
const Session = require('../models/session')
const auth = require('../middleware/auth')

router.post('/bookings', auth, async (req, res) => {
    const booking = new Booking({
        ...req.body,
        owner: req.user._id
    })
    const session = await Session.findById(req.body.session)
    const movie = await Movie.findById(session.movie)

    if(req.user.age < movie.ageLimit) {
      return res.status(403).send({ error: `You must be at least ${movie.ageLimit} years old` })
    }
    try {
        await booking.save()
        res.status(201).send(booking)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/bookings', auth, async (req, res) => {

    try {
        await req.user.populate('bookings')
        res.send(req.user.bookings);
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/bookings/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const booking = await Booking.findOne({_id, owner: req.user._id})

        if (!booking) {
            return res.status(404).send()
        }
        res.send(booking);
    } catch (e) {
        res.status(500).send();
    }
})

router.patch('/bookings/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ['seatNumber'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const booking = await Booking.findOne({_id, owner: req.user._id})

        if (!booking) {
            return res.status(404).send()
        }

        updates.forEach((update) => booking[update] = req.body[update])
        await booking.save()

        res.send(booking);
    } catch (e) {
        res.status(400).send();
    }
})

router.delete('/bookings/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const booking = await Booking.findOneAndDelete({_id, owner: req.user._id})
        if (!booking) {
            return res.status(404).send()
        }
        res.send(booking);
    } catch (e) {
        res.status(400).send();
    }
})

module.exports = router;