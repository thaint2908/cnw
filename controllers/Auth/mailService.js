
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
exports.sendVerifyEmail = async (email) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'thaint.05112000@gmail.com', // generated ethereal user
            pass: 'nfvypdwvcfvdlizt', // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "You have successfully registered your account", // Subject line
        html: '<h2>nghịch tí thôi</h2>',
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
exports.sendConfirmPassword = async () => {
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:'thaint.05112000@gmail.com',
            pass:'nfvypdwvcfvdlizt',
        }
    });
    let data = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        html: '',
    })
}