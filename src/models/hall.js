const mongoose = require('mongoose')

const Hall = mongoose.model('Hall', {
    hallNumber: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Hall number must be a positive number")
            }
        }
    },
    column: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
          if (value < 0) {
              throw new Error("Column number must be a positive number")
          }
        }
    },
    row: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
          if (value < 0) {
              throw new Error("Row number must be a positive number")
          }
        }
    },
})

module.exports = Hall;