const Sequelize = require("sequelize");
const sequelize = require('../util/database');

const Cart = sequelize.define('cart',{
    totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
    } 
});
module.exports = Cart;

