const joi = require('joi')

const Validator = {
    createProductValidation: data => {
        const schema = joi.object({
            SKU: joi.string()
                .min(6)
                .required(),
            name: joi.string()
                .min(6)
                .required(),
            quantity: joi.number()
                .min(0)
                .required(),
            price: joi.number()
                .min(0)
                .required(),
            desc: joi.string()
        })

        return schema.validateAsync(data)
    },

    updateProductValidation: data => {
        const schema = joi.object({
            SKU: joi.string()
                .min(6),
            name: joi.string()
                .min(6),
            quantity: joi.number()
                .min(0),
            price: joi.number()
                .min(0),
            desc: joi.string()
        })

        return schema.validateAsync(data)
    },

    deleteProductValidation: data => {
        const schema = joi.object({
            SKU: joi.string()
                .min(6)
        })

        return schema.validateAsync(data)
    }
}

module.exports = Validator