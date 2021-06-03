const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserRating = sequelize.define('userRating',{

    rating:{
        type:Sequelize.INTEGER([1,5]),
        allowNull: false,
    }
});
module.exports = UserRating;