
const mongoose=require('mongoose');
const SchemaVar=mongoose.Schema;

const registerData=new SchemaVar({

   u_name:{
       type:String,
       required:true
   },
   u_email:{
       type:String,
       required:true
   },
   password:{
       type:String,
       required:true
   }
});

module.exports=mongoose.model('RegisterModel',registerData);
