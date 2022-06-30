
const UserModel = require('../Model/AuthModel');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   host: 'smtp',
   port: 1254,
   secure: false,
   requireTLS: true,
   service: 'gmail',
   auth: {
      user: 'biswassanto0011@gmail.com',
      pass: 'motynfeqfblgxgli'
   }
});

exports.registerForm = (req, res) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0]
   } else {
      message = null
   }
   res.render('Auth/register', {
      title_page: "register page",
      errorMessage: message,
      error: []
   })
};

exports.registerDataCont = (req, res) => {
   const { u_name, u_email, password } = req.body;

   let error = validationResult(req);
   if (!error.isEmpty()) {
      const errorResponse = validationResult(req).array();
      console.log("errorResponse", errorResponse);
      res.render('Auth/register', {
         title_page: "register page",
         errorMessage: '',
         error: errorResponse
      })
   } else {
      UserModel.findOne({ u_email: u_email }).then((userData) => {
         if (userData) {
            console.log("Email is already exist");
            req.flash('error', "Email alredy exist");
            return res.redirect('/register')
         } else {
            bcryptjs.hash(password, 10).then((hashPassword) => {
               const userData = new UserModel({
                  u_name: u_name,
                  u_email: u_email,
                  password: hashPassword
               });
               userData.save().then(() => {
                  console.log("Registration successfully");

                  let mailOptions = {
                     from: 'biswassanto0011@gmail.com',
                     to: u_email,
                     subject: 'Sending Email using Node.js to confirm registration',
                     text: 'You have successfully registered'
                  };
                  transporter.sendMail(mailOptions, (error, info) => {
                     if (error) {
                        console.log("Error to send mail", error);
                     } else {
                        console.log("Email sent" + info.response);
                     }
                  })
                  return res.redirect('/login');
               }).catch((err) => {
                  console.log(err);
               })
            }).catch((err) => {
               console.log(err);
            })
         }
      }).catch((err) => {
         console.log(err);
      });
   }
};

exports.loginFrom = (req, res) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('Auth/login', {
      title_page: "login page",
      errorMessage: message,
      cookie_data: req.cookies
   })
};

exports.logindataCont = (req, res) => {
   const { u_email, password } = req.body;
   const checked = req.body.checked;
   UserModel.findOne({ u_email: u_email }).then((user_data) => {
      if (!user_data) {
         console.log("Invalid email");
         req.flash('error', "Invalid email")
         return res.redirect('/login');
      } else {
         bcryptjs.compare(password, user_data.password).then((userValue) => {
            if (!userValue) {
               console.log("Wrong password");
               req.flash('error', "Wrong password")
               return res.redirect('/login');
            } else {
               console.log("Successfully login");
               req.session.isLoggedIn = true;
               req.session.user = user_data;

               return req.session.save((err) => {
                  if (err) {
                     console.log(err);
                  } else {
                     if (checked) {
                        const userData = {
                           emailCookie: user_data.u_email,
                           passwordCookie: password
                        };
                        res.cookie('user_data', userData, {
                           expires: new Date(Date.now() + 100000),
                           httpOnly: true
                        });
                     }
                  }
                  return res.redirect('/userViews');
               })
            }
         }).catch(err => {
            console.log(err);
         })
      }
   }).catch((err) => {
      console.log(err);
   })
};

exports.logOutController = (req, res) => {
   req.session.destroy();
   res.redirect('/login');
};

exports.getForgetPassword = (req, res) => {
   res.render('Auth/forgerPass', {
      title_page: "forget password",
      para: ''
   })
};

exports.forgetdataCont = (req, res) => {
   const u_email = req.body.u_email;
   UserModel.findOne({ u_email: u_email }).then((userValue) => {
      if (!userValue) {
         console.log("Invalid email");
         req.flash('error', "Invalid email");
         return res.redirect('/forgetPassword');
      } else {
         const userId = userValue._id;
         const url = 'http://127.0.0.3:1254/setNewPassword/' + userId;
         const textForget = "Click here --> ";

         let mailOptions = {
            from: 'biswassanto0011@gmail.com',
            to: u_email,
            subject: 'Forget password',
            text: 'set new password',
            html: textForget.concat(url)
         }
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               console.log("Error to send mail", error);
            } else {
               console.log("Email sent", info.response);
            }
            res.render('Auth/forgerPass', {
               title_page: "forget passwordd",
               para: "Please check your email inbox for a link to complate the reset",
               errorMessage: ''
            })
         })
      }
   }).catch((err) => {
      console.log("No user found", err);
   })
};

exports.setNewPasswordCont = (req, res) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0]
   } else {
      message = null
   }
   const user_id = req.params.id;
   console.log("Collected id to change password", user_id);
   res.render('Auth/setPass', {
      title_page: 'Set password',
      userId: user_id,
      errorMessage:message
   })
};

exports.setDataController = (req, res) => {
   const n_password = req.body.n_password;
   const c_password = req.body.c_password;
   const user_id = req.body.user_id;

   UserModel.findById(user_id).then((user) => {
      const u_name = user.u_name;
      const u_email = user.u_email;

      if (n_password === c_password) {
         return bcryptjs.hash(n_password, 12).then((hashPassword) => {
            user.u_name = u_name,
               user.u_email = u_email,
               user.password = hashPassword

            return user.save().then(() => {
               console.log("Password change");
               res.redirect('/login');
            }).catch((err) => {
               console.log(err);
            })
         }).catch((err) => {
            console.log(err);
         })
      } else {
         console.log("Password dose not match");
         req.flash('error', `Password dosen't match`);
         return res.redirect(`/setNewPassword/${user_id}`)
      }
   }).catch((err) => {
      console.log(err);
   })
};
