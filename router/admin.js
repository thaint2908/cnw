
const express = require('express');
const router = express.Router();
const isAuth = require('../middlerwares/isAuth');

const adminController = require('../controllers/Admin/admin');
const userController = require('../controllers/User/user');

router.post('/addProduct' ,isAuth,adminController.postAddProduct)
router.put('/editProduct/:productId', isAuth,adminController.putEditProduct);
router.delete('/deleteProduct/:productId',isAuth,adminController.deleteProduct);

router.post('/changePassword/:userId',isAuth,adminController.changePassword);
router.post('/addUser',isAuth,userController.createUser);
router.put('/editUser/:userId',isAuth,adminController.putUser);
router.get('/user/:userId',isAuth,userController.getUser);
router.delete('/deleteUser/:userId',isAuth,userController.deleteUser);
router.get('/users',isAuth,userController.getUsers);

module.exports = router;
