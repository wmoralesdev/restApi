const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../Models/UserModel')
const { registerValidation, loginValidation } = require('./Validator')

var UserController = {
    register: async (req, res) => {
        try {
            await registerValidation(req.body)
            const notUnique = await User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] })

            if(notUnique.length != 0)
                throw 'Email or username already registered'

            var hashedPassword = await bcrypt.hash(req.body.password, 10)

            const user = new User({
                name: req.body.name,
                username: req.body.username,
                phone: req.body.phone,
                birthdate: req.body.date,
                email: req.body.email,
                password: hashedPassword
            })

            await user.save()
            return res.status(201).send('Created')
        }
        catch (err) {
            return res.status(400).send(err.details ? err.details[0].message : err)
        }
    },

    login: async (req, res) => {
        try {
            await loginValidation(req.body)
            const user = await User.findOne({email: req.body.email})

            if(user == null)
                throw new Error('Email not found')

            var logged = await bcrypt.compare(req.body.password, user.password)
            if(!logged) return res.status(400).send('Wrong password')

            const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY)
            return res.header('Authorize', token).status(200).send(token)
        }
        catch (err) {
            return res.status(401).send(err.details ? err.details[0].message : err)
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.deleteOne({_id: req.user._id})
            return res.status(200).send('Success')
        }
        catch(err) {
            return res.status(500).send('Something went wrong')
        }
    }
}

module.exports = UserController