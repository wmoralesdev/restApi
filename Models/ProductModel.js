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
    price: {
        type: Number,
        get: getPrice,
        set: setPrice,
        required: true
    },
    desc: String,
    key: String,
    imageLocation: String
})

function getPrice(price) {
    return (price / 100).toFixed(2)
}

function setPrice(price) {
    return (price * 100)
}

module.exports = mongoose.model("Product", ProductSchema)