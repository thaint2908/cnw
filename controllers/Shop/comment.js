const Comment = require('../../model/comment');
const User = require('../../model/user');

exports.getCommentsByProduct = async (req, res, next) => {
    const productId = req.params.productId;
    // const page = req.query.page;
    // let filter = {
    //     limit:10,
    //     offset: (page-1)*10,
    //
    // };
    let comments = await Comment.findAll({
        where: {
            productId: productId,
        },
        include:User,
    });

    // const result = await Promise.all(comments.map(async (comment) => {
    //     let user = await User.findByPk(comment.userId);
    //     comment = {
    //         ...comment,
    //         username: user.firstName + " " + user.lastName
    //     };
    //     return comment;
    // }));
    console.log(comments)
    return res.status(200).json(comments);
};


exports.postComment = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.userId;
    const content = req.body.content; // form
    const comment = await Comment.create({
        productId: productId,
        userId: userId,
        content: content,
    });
    res.status(201).json(comment);
};
exports.putComment = (req, res, next) => {
    const commentId = req.params.commentId;
    const content = req.body.content;
    const filter = {
        where: {
            id: commentId,
        }
    };
    Comment.update({
        content: content
    }, filter)
        .then(result => {
            res.send("Put data successfully");
        })
        .catch(err => {
            console.log(err)
        });
};
exports.deleteComment = (req, res, next) => {
    const commentId = req.params.commentId;
    Comment.destroy({
        where: {
            id: commentId,
        }
    })
        .then(result => {
            res.send("deleted successfully");
        })
        .catch(err => {
            console.log(err)
        });
};