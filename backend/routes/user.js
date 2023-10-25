/************************************************************/
/***************** Routes user *****************************/
/************************************************************/
const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')

// inscription user routes //
router.post ('/signup', userCtrl.signup)
// connection user routes //
router.post ('/login', userCtrl.login)

module.exports = router