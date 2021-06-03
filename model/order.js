const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Order;
