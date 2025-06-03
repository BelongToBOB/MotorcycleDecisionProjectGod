// import ....
const express = require('express')
const router = express.Router()
//import Controller
const { register, login, currentUser } = require('../controller/auth')
const { authCheck, adminCheck } = require('../middlewares/authCheck')

router.post('/register', register)
router.post('/login', login)
router.post('/current-user', authCheck, currentUser)       
router.post('/current-admin', authCheck, adminCheck, currentUser)
router.get('/current-user', authCheck, currentUser);

module.exports = router