var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cors = require('cors');


var bodyParser = require('body-parser');
var assignmentRoutes = require('./routes/Assignment');

var app = express();

var mongoose = require('mongoose');

var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use('/assignment', assignmentRoutes);

//file upload initializer
app.use(fileUpload());

app.post('/upload', (req, res) => {
    if(req.files === null){
        return res.status(400).json({msg: 'No file uploaded'});
    }

    const file = req.files.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        if(err){
            console.error(err);
            res.status(500).send(err);
        }
        res.json({fileName: file.name, filePath: `/uploads/${file.name}`});
    });
})

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

const mongoURI = 'mongodb+srv://dilu:W0WpyKMM39m4W7Ma@cluster3.3bwbyyn.mongodb.net/lmsportal?retryWrites=true&w=majority';

mongoose
    .connect(mongoURI, {useNewUrlParser:true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

var Users = require ('./routes/Users');

app.use('/users', Users);

app.listen(port, ()=> {
    console.log("Server is listening on port" + port);
})
