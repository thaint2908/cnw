const User = require('../../model/user');
const Order = require('../../model/order');
const OrderItem = require('../../model/orderItem');
const Product = require('../../model/product');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require("path");
const appDir = path.dirname(require.main.filename);
exports.getUsers = async (req,res,next) =>{
    const users = await User.findAll();
    console.log(users);
    return res.status(200).json(users)

}
exports.getUser = (req,res,next) => {
    const userId = req.params.userId;
    const filter ={
        where:{
            id: userId,
        },
    }
    User.findOne(filter)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err)});

};
exports.createUser = async (req, res, next) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        imageURL : req.file.path,
        password: req.body.password,
        address:req.body.address,
        dateOfBirth: req.body.dateOfBirth,
        role: 1
    }
    const user = await User.findOne({
        where: {
            email: user.email,
        }
    });
    if(!user){
        const result = await User.create(data);
        return res.status(201).json(result);
    }else{
        return res.status(200).json("Account has already existed!")
    }
};
// Xem lại
exports.putUser = (req, res, next) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const email = req.email;
    const password = req.body.password;
    const address = req.body.address;
    const dateOfBirth = req.body.dateOfBirth;
    let user = {};
    if (firstName) {
        user = {
            ...user,
            firstName: firstName,
        }
    }
    if (lastName) {
        user = {
            ...user,
            lastName: lastName,
        }
    }
    if (phoneNumber) {
        user = {
            ...user,
            phoneNumber: phoneNumber,
        }
    }
    if (password) {
        user = {
            ...user,
            password: password,
        }
    }
    if (address) {
        user = {
            ...user,
            address: address,
        }
    }
    if (dateOfBirth) {
        user = {
            ...user,
            dateOfBirth: dateOfBirth,
        }
    }
    User.update(user,{
        where:{
            email:email,
        }
    })
        .then(result =>{
            res.send("Updated Succesfully");
            })
        .catch(err=>{
            console.log()});
};
exports.deleteUser = async (req,res,next) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if(user){
        await  User.destroy({
            where: {
                id:userId,
            },
        })
    }
};
exports.putAvatar = async (req,res,next) => {
    const userId = req.userId;
    const imageUrl  = req.file.filename;
    console.log(req.file.filename);
    const oldUser = await User.findByPk(userId);
    const oldImageURL = path.join(appDir, "public", "images", `${oldUser.imageURL}`);
    console.log("image old:"+oldImageURL);
    if (imageUrl && oldUser.imageURL) {
        fs.unlink(oldImageURL, (err) => {
            if (err) throw err;
        });
        console.log("xóa ảnh")
    }
    oldUser.imageURL = imageUrl;
    await oldUser.save();
    // console.log(userId);
    // console.log(imageUrl);
    // const newUser = await User.update({
    //     imageUrl: imageUrl,
    // }, {
    //     where: {
    //         id: userId,
    //     }
    // });
    return res.status(200).json(oldUser);
}
// exports.changePassword = async (req,res,next) => {
//     const email = req.email;
//     const currentPassword = req.body.currentPassword;
//     const newPassword = req.body.newPassword;
//     const user = User.findOne({where:{email:email}});
// }
// exports.forgotPassword = (req, res, next) => {
//     const email = req.body.email;
//     User.findOne({
//         where: {email: email},
//     })
//         .then(async (user) => {
//             if (!usenpm r) {
//                 const error = new Error('A user with this email could not be found.');
//                 error.statusCode = 401;
//                 throw error;
//             } else {
//                 await mailService.send(user.email);
//                 res.status(200).send("please check email");
//             }
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }
exports.historyOrder = async (req,res,next) => {
    const userId  = req.userId;
    let rs = [];
    const order = await Order.findAll({
        where:{
            userId:userId
        },
    })
    await Promise.all(order.map(async (o) => {
        let orderItem = await OrderItem.findAll({
            where:{
                orderId:o.id
            },
            include:[
                Order,
                Product,
            ],
        });
        console.log(orderItem);
        rs = [
            ...rs,
            orderItem,
        ]
    }));
    res.status(200).json(rs);
}
