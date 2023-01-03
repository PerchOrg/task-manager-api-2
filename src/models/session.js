const mongoose = require('mongoose')

const Session = mongoose.model('Session', {
    status: {
        type: String,
        trim: true,
        default: 'regular',
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hall'
    }
})

module.exports = Session;