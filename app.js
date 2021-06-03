const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const app = express();
const multer = require('multer');
const cors = require('cors')
const shopRouter = require('./router/shop');
const userRouter = require('./router/user');
const adminRouter = require('./router/admin');
const authRouter = require('./router/auth');
const {relationship} = require('./util/relationship');
const cookieParser = require('cookie-parser');
const isAuth = require('./middlerwares/isAuth');
const roles = require('./constants/roles');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const  fileStorage = multer.diskStorage({ // storage
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/images')
    },
    filename: function (req, file, cb) {
        const mimetype = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now()+'.' + mimetype)
    }
})
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/backend', shopRouter);
app.use('/backend/admin', adminRouter);
app.use('/backend/auth', authRouter);
app.use('/backend/user', userRouter);
app.use('/js',express.static(path.join(__dirname,"public","js")));
app.use('/',express.static(path.join(__dirname,"public","images")));
app.use('/assets/images',express.static(path.join(__dirname,"public","assets","images")))
app.use('/styles',express.static(path.join(__dirname,"public","styles")));
app.use('/plugins',express.static(path.join(__dirname,'public','plugins')));

app.get('/products',isAuth,(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','products.html'));
});
app.get('/cart',isAuth,(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','cart.html'));
});
app.get('/detail',isAuth,(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','detail.html'));
});
app.get('/login',(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','login.html'));
});
app.get('/signup',(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','signup.html'));
});
app.get('/index',(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','index.html'));
});
app.get('/user',isAuth,(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','user.html'));
});
app.get('/contact',(req,res,next) => { //pag
    return res.sendFile(path.join(__dirname,'public','contact.html'));
});
app.get('/admin', isAuth, (req,res,next) => { 
    if (req.role !== roles.ADMIN) {
        res.json(403);
    } else {
        return res.sendFile(path.join(__dirname,'public','admin.html'));
    }
});
app.get('*', function (req, res) {
    res.status(404).json({}); // <== YOUR JSON DATA HERE
});

// app.get('/products/category/:categoryId',(req,res,next) => { //pag
//     return res.sendFile(path.join(__dirname,'public','products.html'));
// });
relationship();


sequelize
    .sync()
    .then(
        app.listen(8080)
    )

    .catch(err => {
        console.log(err)
    })
