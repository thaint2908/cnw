const UserRating = require('../../model/userRating');
const ProductRating = require("../../model/productRating");
const User = require('../../model/user');
const {Op} = require("sequelize");


exports.getUserRating = (req, res, next) => {
    const productId = req.params.productId;  
    console.log(req.params);
    const userId = req.body.userId; 
    let filter = { 
        where: {
            [Op.and]: [
                {productId: productId},
                {userId: userId}
            ]
        }
    } 
    UserRating.findAll(filter)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err)
        });
};
exports.getProductRating = async (req, res, next) => {
    const productId = req.params.productId;
    const productRating = await UserRating.findAll({
        where:{
            productId: productId,
        },
        include:User,
    })
    console.log(productRating);
    return res.status(200).json(productRating);

}

exports.postUserRating = async (req, res, next) => {
    // console.log(req.params, req.query, req.body);
    const productId = req.params.productId;
    const userId = req.userId;
    const rating = parseFloat(req.body.rating);
    let filter = {
        where: {
            [Op.and]: [
                {productId: productId},
                {userId: userId}
            ]
        }
    };
    const userRating = await UserRating.findOne(filter);
    const productRating = await ProductRating.findOne({
        where: {
            productId: productId,
        }
    });
    const oldRatingCount = parseFloat(productRating.ratingCount);
    const oldAvgRating = parseFloat(productRating.avgRating);
    const oldTotalRating = oldRatingCount*oldAvgRating;
    if (!userRating) {
        const newRate = await UserRating.create({
            productId: productId,
            userId: userId,
            rating: rating,
        });
        const newCount = oldRatingCount + 1;   // count +1
        console.log(newCount);
        const  newAvgRating = ((oldTotalRating+rating) / (newCount));
        console.log(newAvgRating);
        const newProductRate =  await ProductRating.update({
            avgRating: newAvgRating,
            ratingCount: newCount,
        },{
            where:{productId:productId},
        });
    } else {
        const newUserRate = await UserRating.update({
            rating: rating,
        }, filter);
        const oldUserRating = userRating.rating;
        const  newAvgRating = (oldTotalRating - oldUserRating + rating)/oldRatingCount;
        const newProductRate = await ProductRating.update({
            avgRating: newAvgRating,
        },{
            where:{productId:productId},
        })
    }
    return res.status(200).json({message: "rate"})

}
