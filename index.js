
const express = require('express');
const app = express();
const PORT = 1254;
const hostName = '127.0.0.3';
const path = require('path');
const mongoose = require('mongoose');
const multer=require('multer');
const session=require('express-session');
const flash=require('connect-flash');
const cookie=require('cookie-parser');
const csurf=require('csurf');

const UserModel=require('./Model/AuthModel');

const admin_router = require('./Router/adminRouter');
const user_router = require('./Router/userRouter');
const auth_router = require('./Router/authRoute');

app.use(flash());

const connect_mongodb=require('connect-mongodb-session')(session);

const storage_value=new connect_mongodb({
     uri:'mongodb+srv://santo:123456Sb@cluster0.annke.mongodb.net/myFirstDatabase',
     collection:'my-session'
});

app.use(session({secret:'secret-key',resave:false,saveUninitialized:false,store:storage_value}));

const db_url = 'mongodb+srv://santo:123456Sb@cluster0.annke.mongodb.net/myFirstDatabase_101?retryWrites=true&w=majority';

app.use(cookie());
const csurfProtention=csurf();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'Public')));

app.use('/upload',express.static(path.join(__dirname,'upload')));

const valuStorage=multer.diskStorage({
       destination:(req,file,cb)=>{
          cb(null,'upload')
       },
       filename:(req,file,cb)=>{
         cb(null,file.originalname);
       }
});

const upload=multer({
     storage:valuStorage,
     limits:{
        fileSize:1024*1024*5
     },
     fileFilter:(req,file,cb)=>{
        if(file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/webp'
        ){
           cb(null,true);
        }else{
            cb(null,false);
        }
     }
});

app.use(upload.single("p_image"));

app.use((req,res,next)=>{
     if(!req.session.user){
         return next();
     }else{
        UserModel.findById(req.session.user._id).then((user_data)=>{
                 req.user=user_data;
                //  console.log("User data",user_data);
                 next()
        }).catch(err=>{
             console.log(err);
        })
     }
});

app.use(csurfProtention);

app.use((req,res,next)=>{
     res.locals.isAuthenticated=req.session.isLoggedIn;
     res.locals.csrf_token=req.csrfToken();
     next();
});

app.use(admin_router);
app.use(user_router);
app.use(auth_router);

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((clientdata) => {
        console.log("Database is connedted", clientdata);
        app.listen(PORT, hostName, () => {
            console.log(`Server is running at http://${hostName}:${PORT}`);
        });
    }).catch((err) => {
        console.log("Database is not connected", err);
    });
