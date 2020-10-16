const joi = require('joi')

const Validator = {
    registerValidation: data => {
        const schema = joi.object({
            name: joi.string()
                .min(6)
                .required(),
            username: joi.string()
                .min(6)
                .required(),
            phone: joi.string()
                .pattern(new RegExp('^[0-9]{8}$')),
            birthdate: joi.date(),
            email: joi.string()
                .min(6)
                .required()
                .email(),
            password: joi.string()
            .min(6)
            .required()
        })

        return schema.validateAsync(data)
    },

    loginValidation: data => {
        const schema = joi.object({
            email: joi.string()
                .min(6)
                .required()
                .email(),
            password: joi.string()
                .min(6)
                .required()
        })

        return schema.validateAsync(data)
    }
}

module.exports = Validator