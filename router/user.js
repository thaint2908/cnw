
const express = require('express');
const router = express.Router();
const isAuth = require('../middlerwares/isAuth');

const userController = require('../controllers/User/user');
router.put('/editUser',isAuth,userController.putUser);

router.put('/avatar/:userId',isAuth,userController.putAvatar);

router.get('/order',isAuth,userController.historyOrder);
module.exports = router;