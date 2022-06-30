
const express=require('express');
const user_router=express.Router();
const Auth=require('../Middleware/isAuth');
const userContImport=require('../Controllers/userController');

user_router.get('/userViews',Auth,userContImport.userViews);

user_router.post('/search_data',userContImport.searchDataCont);

user_router.get('/singleData/:s_id',userContImport.singleDataCont);

user_router.post('/addToCart',userContImport.addToCartCont);

user_router.get('/cartPage',Auth,userContImport.cartPageDisplay);

user_router.get('/deleteCart/:c_del',userContImport.deleteCartCont);

module.exports=user_router;
