

const Order = require('../../model/order');
const CartItem = require("../../model/cartItem");
const Cart = require("../../model/cart");
const OrderItem = require("../../model/orderItem");
const User = require("../../model/user");
const Product = require("../../model/product");

exports.getOrders = async (req,res,next) => {
    if (req.role === 1) {
        res.status(403).json({
            message: 'Forbidden'
        });
    }
    const orders = await Order.findAll({
        include:[
            User,
        ]}
    );
    console.log(orders);
    return res.status(200).json(orders);
};
exports.getOrder = async (req,res,next) => {
    const orderId = req.params.orderId;
    const order = await Order.findByPk(orderId);
    console.log(order)
    const orderItem = await OrderItem.findAll({
        where: {orderId: orderId},
        include: [
            Product,
        ],
    });
    const user = await User.findOne({
        where:{
            id: order.userId,
        }
    })
    console.log(user,orderItem)
    return res.status(200).json({orderItem,user});
}
// exports.postOrder = async (req,res,next ) => {
//     const userId = req.userId;
//     const cart = await Cart.findOne({
//         where:{
//             userId:userId,
//         }
//     });
//     const cartItems = await CartItem.findAll({
//         where:{
//             cartId:cart.id,
//         }
//     });
//     let order = await Order.create({totalPrice: cart.totalPrice, userId:userId});
//       await Promise.all(cartItems.map(async (c) => {
//           let orderItem = await OrderItem.create({
//               orderId: order.id,
//               quantity: c.quantity,
//               productId: c.productId,
//           });
//           let cartItem = await CartItem.destroy({
//               where: {
//                   cartId: c.cartId,
//               }
//           })
//       }))
//     res.status(200).json(order);
// }
exports.postOrder = async (req,res,next ) => {
    const userId = req.userId;
    const cart = await Cart.findOne({
        where:{
            userId:userId,
        }
    });
    const cartItems = await CartItem.findAll({
        where:{
            cartId:cart.id,
        }
    });
    let order = await Order.create({totalPrice: cart.totalPrice, userId:userId});
      await Promise.all(cartItems.map(async (c) => {
          let product = await Product.findByPk(c.productId);
          let newAmount = product.amount - c.quantity;
          let updateProduct = await Product.update({
              amount: newAmount,
          },{where:{id:c.productId}});
          let orderItem = await OrderItem.create({
              orderId: order.id,
              quantity: c.quantity,
              productId: c.productId,
          });
          let cartItem = await CartItem.destroy({
              where: {
                  cartId: c.cartId,
              }
          })
      }))
    res.status(200).json(order);
}