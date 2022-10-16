const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const passport = require('passport');
const { registerUser, loginUser, logOutUser, renderRegister, renderLogin } = require('../controllers/userevent');

//register form 
router.get('/register', renderRegister);

//registering user
router.post('/register', catchAsync(registerUser));


router.get('/login', renderLogin)



router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUser)


router.get('/logout', logOutUser)


module.exports = router;