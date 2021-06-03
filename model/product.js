const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Product = sequelize.define('product', {

    name: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    summaryDescription: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    origin:{
        type:Sequelize.STRING,
        allowNull:false
    },
    imageURL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
module.exports = Product;