const express = require('express')
const router = new express.Router()
const Hall = require('../models/hall')
const auth = require('../middleware/auth')

router.post('/hall', (req, res, next) => auth(req, res, next, 'admin'), async (req, res) => {
    const hall = new Hall(req.body)

    try {
        await hall.save()
        res.status(201).send(hall)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;