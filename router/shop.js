const express = require('express');
const router = express.Router();
const isAuth = require('../middlerwares/isAuth');
const productController = require('../controllers/Shop/product');
const rateController = require('../controllers/Shop/rate');
const commentController = require('../controllers/Shop/comment');
const cartController = require('../controllers/Shop/cart');
const cateController = require('../controllers/Shop/category');
const orderController = require('../controllers/Shop/order');

router.get('/products', isAuth, productController.getProducts);
router.get('/newProducts',productController.getNewProduct);
router.get('/featureProducts',productController.getFeatureProduct);
router.get('/product/:productId', productController.getProduct);
router.get('/products/search', productController.getSearch);
router.get('/product/:productId/rate', rateController.getUserRating);
router.get('/product/:productId/rates', rateController.getProductRating);
router.post('/product/:productId/rate', isAuth, rateController.postUserRating);
router.get('/product/:productId/comments', commentController.getCommentsByProduct);
router.post('/product/:productId/comment', isAuth, commentController.postComment);
router.put('/product/:productId/comment/:commentId', isAuth, commentController.putComment);
router.delete('/product/:productId/comment/:commentId', isAuth, commentController.deleteComment);

router.get('/newProduct',productController.getNewProduct);
router.get('/featureProduct',productController.getFeatureProduct);

 
router.get('/carts', isAuth, cartController.getCart); // Lấy tất cả các sản phẩm trong giỏ hàng
router.post('/cart', isAuth , cartController.addToCart);  // Thêm sản phẩm vào giỏ hàng
router.delete('/cart/:productId', isAuth, cartController.deleteFromCart);

router.get('/categories',cateController.getCategory);  // lấy cái list
router.get('/products/category/:categoryId',cateController.getProductByCategory);

router.post('/order',isAuth,orderController.postOrder);
router.get('/orders',isAuth,orderController.getOrders);
router.get('/order/:orderId',isAuth,orderController.getOrder);
  
module.exports = router;