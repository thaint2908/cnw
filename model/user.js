const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    firstName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    lastName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    phoneNumber:{
      type:Sequelize.STRING(10),
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    dateOfBirth:{
        type: Sequelize.DATEONLY,
        allowNull:false,
    },
    address:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    imageURL: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    role:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
});
module.exports = User;