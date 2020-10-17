const express = require('express')
const router = express.Router()

const verify = require('./VerifyToken')
const UserController = require('../Controllers/User/UserController')

router.get('/current', verify, UserController.getCurrent)
router.get('/', UserController.getAll)

router.post('/login', UserController.login)
router.post('/reg', UserController.register)

router.delete('/delete', verify, UserController.deleteUser)

router.put('/request-recover', UserController.resetPassword)
router.put('/request-handle', UserController.resetPasswordHandler)
router.put('/update', verify, UserController.updateUser)

module.exports = router