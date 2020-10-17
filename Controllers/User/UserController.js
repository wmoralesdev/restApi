const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mailer = require('../Utilities/SendGridMailer')
const User = require('../../Models/UserModel')
const { registerValidation, loginValidation, updateValidation, resetPasswordValidation } = require('./Validator')

var UserController = {
    register: async (req, res) => {
        try {
            await registerValidation(req.body)
            const notUnique = await User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] })

            if(notUnique.length != 0)
                throw "Email or username already registered"

            var hashedPassword = await bcrypt.hash(req.body.password, 10)

            const user = new User({
                name: req.body.name,
                username: req.body.username,
                phone: req.body.phone,
                birthdate: req.body.birthdate,
                email: req.body.email,
                password: hashedPassword
            })

            await user.save()
            return res.status(201).json({_id: user._id})
        }
        catch (err) {
            return res.status(400).json(err.details ? err.details[0].message : err)
        }
    },

    login: async (req, res) => {
        try {
            await loginValidation(req.body)
            const user = await User.findOne({email: req.body.email})

            if(user == null)
                return res.status(404).json( {error: true, message: "Email not found"})

            var logged = await bcrypt.compare(req.body.password, user.password)
            if(!logged) return res.status(400).json({error: true, message: "Wrong password"})

            const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY)
            return res.header('Authorize', token).status(200).json(token)
        }
        catch (err) {
            return res.status(401).json(err.details[0].message)
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.deleteOne({_id: req.user._id})
            return res.status(200).json({error: false, message: "Success"})
        }
        catch(err) {
            return res.status(500).json("Something went wrong")
        }
    },

    updateUser: async (req, res) => {
        try {
            await updateValidation(req.body)
            var actualUser = await User.findOne({_id: req.user._id})
            const matchUsers = await User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] })

            var unique = true

            if(matchUsers.length != 0)
                matchUsers.forEach(u =>  {
                    if(u.username == req.body.username || u.email == req.body.email) 
                        unique = false
                })

            if(!unique)
                throw {error: true, message: "Email or username already registered"}

            var hashedPassword = req.body.password == null ? null : await bcrypt.hash(req.body.password, 10)

            actualUser = {
                name: req.body.name || actualUser.name,
                username: req.body.username || actualUser.username,
                phone: req.body.phone || actualUser.phone,
                birthdate: req.body.birthdate || actualUser.birthdate,
                email: req.body.email || actualUser.email,
                password: hashedPassword || actualUser.password
            }

            await User.findOneAndUpdate({_id: req.user._id}, actualUser)
            return res.status(200).json(actualUser)
        }
        catch (err) {
            return res.status(400).json(err.details ? err.details[0].message : err)
        }
    },

    getCurrent: async (req, res) => {
        const user = await User.findOne({_id: req.user._id})
        return res.status(200).json(user)
    },

    getAll: async(req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query
            const users = await User.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await User.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                users
            })
        }
        catch(err) {
            return res.status(500).json({error: true, message: "Something went wrong"})
        }
    },

    resetPassword: async (req, res) => {
        try {
            await resetPasswordValidation(req.body)
            var user = await User.findOne({email: req.body.email})

            if(!user)
                return res.status(404).json({error: true, message: "Email not found"})

            const token = jwt.sign({_id: user._id}, process.env.TOKEN_RESET_KEY, {expiresIn: '15m'})
            const recoverEmail = {
                to: req.body.email,
                from: process.env.MAIL,
                subject: 'RestApi: Recover your password',
                html: 
                `
                    <h1> Greetings ${user.name}! </h1>
                    <p> To recover your password please enter in the following link: 
                    ${process.env.CLIENT_URL}/auth/${token}</p>
                `
            }
            
            await User.findOneAndUpdate({_id: user._id}, {recoverLink: token})
            await mailer(recoverEmail)
            return res.header('Authorize', token).status(200).json({error: false, message: "Email sent"})
        }
        catch(err) {
            return res.status(500).json(err)
        }
    },

    resetPasswordHandler: async (req, res) => {
        try {
            const token = req.header('Authorize')
            
            if(token) {
                const verified = jwt.verify(token, process.env.TOKEN_RESET_KEY)

                if(verified) {
                    var user = await User.findOne({recoverLink: token})

                    user.password = await bcrypt.hash(req.body.newPassword, 10)
                    user.resetLink = ''
                    
                    await User.findOneAndUpdate({_id: user._id}, {password: user.password, recoverLink: ''})
                    return res.status(200).json({error: false, message: 'Updated'})
                }
            }
            else {
                return res.status(401).json({error: false, message: 'Access denied'})
            }
        }
        catch(err) {
            return res.status(500).json({error: true, message: "Something went wrong"})
        }
    }
}

module.exports = UserController