const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const mailService = require('./mailService');
const User = require("../../model/user");
const Cart = require("../../model/cart");
const Order = require("../../model/order");


exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    //console.log(req.body.email);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(hashedpw => { 
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hashedpw,
                imageURL:req.file.filename, 
                dateOfBirth: req.body.dateOfBirth,
                address:req.body.address,
                role: 1
            };
            User.findOne({
                where: {
                    email: user.email,
                }
            })
                .then(result => {
                    // console.log(result);
                    if (!result) {
                        User.create(user)
                            .then(async (result)=> {
                               // await mailService.sendVerifyEmail(result.email);
                                await Cart.create({userId: result.id, totalPrice: 0});
                                res.status(201).json({message: 'User created!', userId: result.id});
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    } else {
                        res.send("Account has already existed!");
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.login = (req, res, next) => {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    let loadUser;
    User.findOne({
        where:{
            email:email
        }
    })
        .then(user => {
            if (!user) {
                return res.status(401).json({message:"A user with this email could not be found."})
            }
            loadUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                return res.status(401).json({message:"wrong password"});
            }
            const token = jwt.sign(
                {
                    email: loadUser.email,
                    userId: loadUser.id,
                    role: loadUser.role
                },
                'tokenlogin',
                {expiresIn: '18000000'}
            );

            res.status(200).json({token: token});
        })
        .catch(err => {
            console.log(err)
        });
};

//COOKIE TEST

// exports.getConfirm = (req,res,next) => {
//     const userId = req.query.userId;
//     res.redirect('/');
// }
// exports.postConfirm = (req,res,next) => {
// }