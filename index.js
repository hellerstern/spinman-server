const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const app = express();

app.use(cors({
    origin: '*'
}));
  
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({limit: "50mb", extended: true}))

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
});

app.post('/send_mail', (req, res) => {
// var url = req.body.data_url;
// var url1 = url.split("base64,")[1];
// var attach = new Array();
// for (var i = 0; i < req.body.images.length; i++) {
//   var data_url = req.body.images[i].data_url.split('base64')[1];
//   attach.push({
//     filename: req.body.images[i].name,
//     content: data_url,
//     encoding: 'base64'
//   })
// }
var transport = nodemailer.createTransport(
    smtpTransport({
        service: "Gmail",
        auth: {
            user: "jakus.superdev@gmail.com",
            pass: "fjxxdvcppecaaqtu",
        },
    })
);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'jakus.superdev@gmail.com', // sender address
    to: "jakus.superdev@gmail.com", // list of receivers
    subject: "User sent msg.", // Subject line
    text: "User sent msg.", // plaintext body
    html: "<html><body><p>Name: " + req.body.name + "</p><p>Email:" + req.body.email + "</p><p>Message:" + req.body.msg + "</p></body></html>",
//   attachments: attach
};
// send mail with defined transport object
transport.sendMail(mailOptions, function (error, response) {
    if (error) {
    res.send({'error': 'Something wrong!'});
    console.log(error);
    } else {
    console.log('Suceess');
    res.status(200).json({success: 'Hello'});
    }
});
})

app.listen(process.env.PORT || 5000, () => console.log("Server is running on 5000"));