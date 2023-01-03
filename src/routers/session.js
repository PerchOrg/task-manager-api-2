const express = require('express');
const router = new express.Router();
const Session = require('../models/session')
const auth = require('../middleware/auth')

router.post('/session', (req, res, next) => auth(req, res, next, 'admin'), async (req, res) => {
    const session = new Session(req.body)

    try {
        await session.save()
        res.status(201).send(session)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;