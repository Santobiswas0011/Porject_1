
const mongoose=require('mongoose');
const SchemaVar=mongoose.Schema;

const cartItem=new SchemaVar({

   p_id:{
       type:String,
       required:true
   },
   quantity:{
       type:String,
       required:true
   },
   user_id:{
       type:String,
       required:true
   },
   cart:[{
      type:Object,
      required:true
   }]
});

module.exports=mongoose.model('myCart',cartItem);
