const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const multer = require('multer');
const uuidv4 = require('uuid/v4');

const app = express();

app.use(cors({
    origin: '*'
}));
  
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({limit: "50mb", extended: true}))

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
});

const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

app.use("/public", express.static("public"));

app.post('/upload', upload.single('uploadFile'), (req, res, next) => {
    // const url = req.protocol + '://' + req.get('host');
    // const imgLink = url + '/public/' + req.file.filename;
    // res.status(200).send(imgLink);
    res.status(200).send("OK");
});

app.post('/send_mail', (req, res) => {
    var transport = nodemailer.createTransport(
        smtpTransport({
            service: "Gmail",
            auth: {
                user: "jakus.superdev@gmail.com",
                pass: "",
            },
        })
    );

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'jakus.superdev@gmail.com', // sender address
        to: "jakus.superdev@gmail.com", // list of receivers
        subject: "User sent msg.", // Subject line
        text: "User sent msg.", // plaintext body
        html: "<html><body><p>Name: " + req.body.name + "</p><p>Email: " + req.body.email + "</p><p>Message: " + req.body.msg + "</p><p>attachedFile: "+ req.body.fileUrl +"</p></body></html>",
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
