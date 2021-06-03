const Category = require('../../model/category');
const Product = require("../../model/product");
const ProductRating = require("../../model/productRating");


exports.getCategory = async (req, res, next) => {
    const categories =  await Category.findAll();
    console.log(categories)
    res.status(200).json(categories);
}; 
exports.getProductByCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId; // hoặc là bo dy
    let orderBy = req.query.orderBy;
    const sort = req.query.sortBy;
    const page = req.query.page;
    if (!orderBy) {
        orderBy = "name";
    }
    let filter = {where:{
        categoryId: categoryId,
        },
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
    };
    console.log(filter);
    const products = await Product.findAll(filter);
    res.status(200).json(products)
}