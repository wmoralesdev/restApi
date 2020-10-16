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
    },

    updateValidation: data => {
        const schema = joi.object({
            name: joi.string()
                .min(6),
            username: joi.string()
                .min(6),
            phone: joi.string()
                .pattern(new RegExp('^[0-9]{8}$')),
            birthdate: joi.date(),
            email: joi.string()
                .min(6)
                .email(),
            password: joi.string()
            .min(6)
        })

        return schema.validateAsync(data)
    },
    
    resetPasswordValidation: data => {
        const schema = joi.object({
            email: joi.string()
                .min(6)
                .email()
        })

        return schema.validateAsync(data)
    }
}

module.exports = Validator