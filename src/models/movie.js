const mongoose = require('mongoose')

const Movie = mongoose.model('Movie', {
    filmName: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    ageLimit: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    poster: {
        type: Buffer,
    }
})

module.exports = Movie;