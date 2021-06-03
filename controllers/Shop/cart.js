const Product = require("../../model/product");
const Cart = require('../../model/cart');
const CartItem = require('../../model/cartItem');
const Order = require("../../model/order");

exports.addToCart = async (req, res, next) => { // post /Cart
    const productId = req.body.productId;
    const userId = req.userId;
    const count = parseInt(req.body.quantity);
    const cart = await Cart.findOne({where: {userId: userId}});

    let cartItem = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId: productId,
        }
    });

    const product = await Product.findByPk(productId);
    const price = parseInt(product.price);
    cart.totalPrice += price*count;
    if (cartItem) {
        cartItem.quantity += count;
        await CartItem.update({quantity: cartItem.quantity}, {
            where: {
                cartId: cart.id,
                productId: productId,
            }
        });


        await Cart.update({totalPrice: cart.totalPrice},
            {
                where: {
                    userId: userId,
                }
            })
        return res.status(200).json({cartItem, toalPrice: cart.totalPrice});
    } else {
        cartItem = await CartItem.create({
            cartId: cart.id,
            productId: productId,
            quantity: count,
        });
        await Cart.update({totalPrice: cart.totalPrice},
            {
                where: {
                    userId: userId,
                }
            })
        return res.status(200).json({cartItem, toalPrice: cart.totalPrice});
    }
}



// exports.addToCart = async (req, res, next) => { // post /Cart
//     const productId = req.body.productId;
//     const userId = req.userId;
//     const cart = await Cart.findOne({where: {userId: userId}});

//     let cartItem = await CartItem.findOne({
//         where: {
//             cartId: cart.id,
//             productId: productId,
//         }
//     });

    
//     const product = await Product.findByPk(productId);
//     const price = product.price;
//     cart.totalPrice += price;
//     if (cartItem) {
//         cartItem.quantity++;
//         await CartItem.update({quantity: cartItem.quantity}, {
//             where: {
//                 cartId: cart.id,
//                 productId: productId,
//             }
//         });


//         await Cart.update({totalPrice: cart.totalPrice},
//             {
//                 where: {
//                     userId: userId,
//                 }
//             })
//         return res.status(200).json({cartItem, toalPrice: cart.totalPrice});
//     } else {
//         cartItem = await CartItem.create({
//             cartId: cart.id,
//             productId: productId,
//             quantity: 1,
//         });
//         await Cart.update({totalPrice: cart.totalPrice},
//             {
//                 where: {
//                     userId: userId,
//                 }
//             })
//         return res.status(200).json({cartItem, toalPrice: cart.totalPrice});
//     }


// }


exports.getCart = async (req, res, next) => {

    const userId = req.userId;
    const cart = await Cart.findOne({where: {userId: userId}});
    let fetchedCart = await CartItem.findAll({
        where: {
            cartId: cart.id,
        },
        include:Product,
    });
    return res.status(200).json(fetchedCart);
}
exports.deleteFromCart = async (req, res, next) => {
    const userId = req.userId;
    const productId = req.params.productId;
    const cart = await Cart.findOne({
        where:{
            userId:userId,
        }
    });

    await CartItem.destroy({
        where:{
            productId:productId,
            cartId:cart.id,
        }
    })
    res.status(200).json("Deleted product succesfully");
}
