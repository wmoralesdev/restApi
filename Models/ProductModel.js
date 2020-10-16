const mongoose = require('mongoose')

var ProductSchema = mongoose.Schema({
    SKU: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: String
})

module.exports = mongoose.model("Product", ProductSchema)