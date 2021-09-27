const express = require('express')

const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'));
//make the contact page the the first page on the app
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
});

//port will be 5000 for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

const sendMail = (name, email, subject, text, cb) => {
    const mailOptions = {
        sender: name,
        from: email,
        to: process.env.MAIL_USERNAME,
        subject: subject,
        text: text
    };
    console.log('mailOptions: ', mailOptions);
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
    console.log('came here')
}

app.post('/', (req, res) => {
    console.log('Data: ', req.body);

    sendMail(req.body.name, req.body.email, req.body.subject, req.body.message, function (err, data) {
        if (err) {
            res.status(500).json({ message: 'Internal Error' });
        } else {
            res.status({ message: 'Email sent!!!' });
        }
    });
    return res.redirect('/')
    // res.json({ message: 'Message received!!!' })
});






