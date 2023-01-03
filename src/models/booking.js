const mongoose = require('mongoose')

const Booking = mongoose.model('Booking', {
    seatNumber: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('seat number must be a positive number')
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Session' 
    }
})

module.exports = Booking;