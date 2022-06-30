
const mongoose=require('mongoose');
const SchemaVar=mongoose.Schema;

const addProduct=new SchemaVar({
      
   p_title:{
       type:String,
       required:true
   },
   p_price:{
       type:String,
       required:true
   },
   p_desc:{
       type:String,
       required:true
   },
   p_image:{
       type:String,
       required:true
   }
});

module.exports=mongoose.model('product_data',addProduct);
