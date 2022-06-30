
const express=require('express');
const admin_router=express.Router();
const adminContImport=require('../Controllers/adminController');


admin_router.get('/',adminContImport.homepage);

admin_router.get('/addProduct',adminContImport.addProductDisplay);

admin_router.post('/productData',adminContImport.productDataCont);

admin_router.get('/product',adminContImport.productDisplay);

admin_router.get('/editPage/:edit_id',adminContImport.editController);

admin_router.post('/editData',adminContImport.editDataCont);

admin_router.get('/delete/:delete_id',adminContImport.deleteController);

module.exports=admin_router;
