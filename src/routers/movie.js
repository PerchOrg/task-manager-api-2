const express = require('express');
const router = new express.Router();
const multer = require('multer')
const sharp = require('sharp')
const Movie = require('../models/movie')
const auth = require('../middleware/auth')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('please upload an image'))
      }

      cb(undefined, true)
    }
})

router.post('/movie', (req, res, next) => auth(req, res, next, 'admin'), upload.single('poster'), async (req, res) => {
    if(!req.file){
      return res.status(400).send()
    }
    const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer()
    const moviePoster = {
        ...req.body,
        poster: buffer
    }
    const movie = new Movie(moviePoster)

    try {
        await movie.save()
        res.status(201).send(movie)
    } catch (e) {
        res.status(400).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

module.exports = router;