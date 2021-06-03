const Product = require('../../model/product');
const Category = require("../../model/category");
const ProductRating = require("../../model/productRating");
const {Op} = require("sequelize");
const {nonAccentVietnamese} = require("../../util/non-vietnamese");


exports.getProducts = (req, res, next) => {

    const page = req.query.page;
    let orderBy = req.query.orderBy;
    const sort = req.query.sortBy;
    // console.log(req.query);
    if(!orderBy){
        orderBy = "name";
    }
    let filter = {

        include: [
            Category,
            ProductRating
        ]
    };

    if (page) {
        filter = {
            ...filter,
            limit: 12,
            offset: (page - 1) * 12
        };
    }

    if (orderBy) {
        if (!sort) {
            filter = {
                ...filter,
                order: [
                    [orderBy, 'ASC']
                ]
            };
        } else {
            if (sort == 'asc') {
                filter = {
                    ...filter,
                    order: [
                        [orderBy, 'ASC']
                    ]
                };
            } else if (sort == 'desc') {
                filter = {
                    ...filter,
                    order: [
                        [orderBy, 'desc']
                    ]
                };
            }
        }
    }
    console.log(filter)
    Product.findAll(filter)
        .then(products => {
            res.send(products);    // fetch()  hiển thị tất cả sp return JSON
        })
        .catch(err => {
            console.log(err);
        })
}

// Đã check lấy thông tin chi tiết 1 sp
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findOne({where:{id:productId},include:[Category,ProductRating]})
        .then(product => {
            res.send(product); // json
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getSearch = (req, res, next) => {
    const page = req.query.page; // page
    const orderBy = req.query.orderBy; // name
    const sort = req.query.sortBy; //
    let search = req.query.searchBy;
    nonAccentVietnamese(search);
    let filter = {include: Category};
    if (page) {
        filter = {
            ...filter,
            limit: 12,
            offset: (page - 1) * 12
        };
    }
    if (orderBy) {
        if (!sort) {
            filter = {
                ...filter,
                order: [
                    [orderBy, 'ASC']
                ]
            };
        } else {
            if (sort == 'asc') {
                filter = {
                    ...filter,
                    order: [
                        [orderBy, 'ASC']
                    ]
                };
            } else if (sort == 'desc') {
                filter = {
                    ...filter,
                    order: [
                        [orderBy, 'desc']
                    ]
                };
            }
        }
    }
    if (search) {
        filter = {
            ...filter,
            where: {
                name: {
                    [Op.like]: `%${search}%`
                },
            }
        }
    }
    Product.findAll(filter)
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            console.log(err);
        })
}
exports.getNewProduct = async (req,res,next) => {
    const products = await Product.findAll({
        order:[
            ['createdAt','DESC'],
        ]
    })
    return res.status(200).json(products);
};
exports.getFeatureProduct = async (req,res,next) => {
    const products = await Product.findAll({
        include:ProductRating,
        order:[
            ['productRating','avgRating','DESC'],
        ]
    });
    return res.status(200).json(products);
}
