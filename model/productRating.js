const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ProductRating = sequelize.define('productRating',{
    avgRating:{
        type:Sequelize.FLOAT,
        allowNull:false,
    },
    ratingCount:{
        type:Sequelize.INTEGER,
        allowNull: false,
    },
});
module.exports = ProductRating;