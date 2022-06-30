
const express=require('express');
const auth_router=express.Router();
const{check,body}=require('express-validator');
const authContImport=require('../Controllers/authController');

auth_router.get('/register',authContImport.registerForm);

auth_router.post('/registerData',[
    body('u_name',"Enter valid User name").isLength({min:3,max:12}),
    check('u_email').isEmail().withMessage("Enter valid eamil"),
    body('password',"Enter valid password").matches('^(?=.*[a-z0-9])(?=.*[A-Z])(?=.*[!@#%&*]).{4,12}$')
],authContImport.registerDataCont);

auth_router.get('/login',authContImport.loginFrom);

auth_router.post('/logindata',authContImport.logindataCont);

auth_router.get('/logout',authContImport.logOutController);

auth_router.get('/forgetPassword',authContImport.getForgetPassword);

auth_router.post('/forgetData',authContImport.forgetdataCont);

auth_router.get('/setNewPassword/:id',authContImport.setNewPasswordCont);

auth_router.post('/setPasswordData',authContImport.setDataController)

module.exports=auth_router;
