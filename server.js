var express = require('express')
var multer = require('multer')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var app = express();
var ejs = require('ejs')
app.set('view engine' , 'ejs')
app.use(express.static('uploads'))
// app.use(bodyParser.urlencoded(extended:true))

mongoose.connect('mongodb://localhost/studies');

//Schema
userSchema = new mongoose.Schema({
    fname: String,
    lname:String, 
    image:String
});

//userMOdel 
userModel = mongoose.model('user' , userSchema); //user is name of our collection and it is  singular but plural in mongodb

var upload = multer({
    storage:multer.diskStorage ({
        destination:(req,file, cb)=>{
            cb(null, './uploads')
        },
        filename:function(req,file, cb){
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // how multer save our file 
        }
    })
});
app.get('/',(req,res)=>{
    res.render('home')
})

app.post('/post', upload.single('image'), (req,res)=>{
    console.log(req.file);
    var x = new userModel();
    x.fname = req.body.fname;
    x.lname = req.body.lname;
    x.image = req.file.filename;
    x.save((err , doc)=>{
        if(!err){
            console.log("Save succesfully ")
            res.redirect('/users');
        }else{
            console.log(err)
        }
    })
});


app.get('/users',(req,res)=>{
    userModel.find().then(function(doc){
        res.render('user', {
            item:doc
        })
    })
})

app.listen(4000,()=>{
    console.log('running on port 3000')
});