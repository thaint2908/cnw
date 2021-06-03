const express = require('express');
const {body} = require('express-validator');

const authController = require('../controllers/Auth/auth');
const User = require('../model/user');
const router = express.Router();
const isAuth = require('../middlerwares/isAuth');
router.post(
    '/signup', 
    [body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        ,
        body('password')
            .trim()
            .isLength({min: 5})
    ],
    authController.signUp
)
 // chạy r thì đ phải do be -.- biet the nhung t dang xem qu
router.post('/login', authController.login);
// router.put('/forgotPassword', authController.forgotPassword);
// router.post('/emailActivate',authController.activateAccount);
//router.get('/confirmpw/',authController.sendconfirm);
module.exports = router;
