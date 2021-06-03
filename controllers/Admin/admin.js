const Product = require('../../model/product');
const ProductRating = require(`../../model/productRating`)
const User = require('../../model/user');
const {validationResult} = require('express-validator');
const fs = require('fs');
const Category = require("../../model/category");
const path = require('path');
const UserRating = require("../../model/userRating");
const bcrypt = require('bcrypt');
const appDir = path.dirname(require.main.filename);


//Đã check tạo sản phẩm mới
exports.postAddProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        return res.status(422).json(error);
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        return res.status(422).json(error);
    }
    // console.log(req.body);
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const summaryDescription = req.body.summaryDescription;
    const category = req.body.category;
    const imageURL = req.file.filename;
    const amount = req.body.amount;
    const origin = req.body.origin;

    const avgRating = 0;
    const count = 0;
    let newproductRating;
    if (!imageURL) {
        const error = new Error('Please upload a file')
        error.statusCode = 400
        return next(error)
    }
    let newcategory = await Category.findOne({
        where: {
            title: category
        }
    });
    if (!newcategory) {
        newcategory = await Category.create({title: category})
    }
    let product = await Product.findOne({
        where: {
            name: name,
            price: price,
            description: description,
            summaryDescription: summaryDescription,
            categoryId: newcategory.id,
            imageURL: imageURL,
            amount: amount,
            origin: origin,
        }
    });
    if (!product) {
        product = await Product.create({
            name: name,
            price: price,
            description: description,
            summaryDescription: summaryDescription,
            categoryId: newcategory.id,
            imageURL: imageURL,
            origin: origin,
            amount: amount,
        });
        newproductRating = await ProductRating.create({
            avgRating: avgRating,
            ratingCount: count,
            productId: product.id,
        });
    }

    res.status(201).json(product, newproductRating, newcategory);
}
exports.putEditProduct = async (req, res, next) => {

    const productId = req.params.productId;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const summaryDescription = req.body.summaryDescription;
    const category = req.body.category;
    const imageURL = req.file.filename;
    console.log(imageURL);
    const amount = req.body.amount;
    const origin = req.body.origin;
    let product = {};
    // Kiểm tra xem thay đổi thông tin gì
    if (name) {
        product = {
            ...product,
            name: name,
        }
    }
    if (price) {
        product = {
            ...product,
            price: price,
        }
    }
    if (amount) {
        product = {
            ...product,
            amount: amount,
        }
    }
    if (origin) {
        product = {
            ...product,
            origin: origin,
        }
    }
    if (description) {
        product = {
            ...product,
            description: description,
        }
    }
    if (summaryDescription) {
        product = {
            ...product,
            summaryDescription: summaryDescription,
        }
    }
    if (category) {
        product = {
            ...product,
            category: category,
        }
    }
    if (imageURL) {
        product = {
            ...product,
            imageURL: imageURL,
        }
    }

    const oldproduct = await Product.findByPk(productId);
    const oldImageURL = path.join(appDir, "public", "images", `${oldproduct.imageURL}`);
    if (imageURL) {
        fs.unlink(oldImageURL, (err) => {
            if (err) throw err;
        });
    }
    const newproduct = await Product.update(product, {
        where: {
            id: productId
        }
    });
    return res.status(200).json(newproduct);
}
// add delete
exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId)
    console.log(product);

    const oldImageURL = path.join(appDir, "public", "images", `${product.imageURL}`);
    console.log(oldImageURL)
    // if(product.imageURL){
    //     fs.unlink(oldImageURL, (err) => {
    //         if (err) throw err;
    //     });
    // }
    if (product) {
        await UserRating.destroy({
            where: {
                productId: productId,
            }
        });
        await ProductRating.destroy({
            where: {
                productId: productId,
            }
        })
        await Product.destroy({
            where: {
                id: productId,
            },

        });
        res.status(200).json({message: "delete "});
    }


};
exports.putUser = async (req, res, next) => {
    const userId = req.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const address = req.body.address;
    // const imageUrl = req.file.filename;
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


    const newUser = await User.update(user, {
        where: {
            id:userId,
        }
    });
    return res.status(200).json(newUser);
};

exports.changePassword = async function(req, res){
    let userId = req.params.userId;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let reNewPassword = req.body.reNewPassword;

    let user = await User.findOne({where: {id: userId}});
    bcrypt.compare(currentPassword, user.password, async function(err, isMatch){
        if(err) throw err;
        if(!isMatch) return res.json({token: 0});
        else{
            if(!newPassword || !reNewPassword) return res.json({token: 0});
            if(newPassword != reNewPassword) return res.json({token: 0});
            let hashedPassword = bcrypt.hashSync(newPassword, 12);
            await User.update({
                password: hashedPassword
            }, {where: {id: userId}});
            return res.json({token: 1});
        }
    });
}