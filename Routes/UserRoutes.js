const express = require('express')
const router = express.Router()

const verify = require('./VerifyToken')
const UserController = require('../Controlers/UserController')

router.post('/login', UserController.login)
router.post('/reg', UserController.register)

router.delete('/delete', verify, UserController.deleteUser)

module.exports = router