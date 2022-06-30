
const PrductModel = require('../Model/ProductModel');
const CartModel = require('../Model/Cart');

exports.userViews = (req, res) => {
   PrductModel.find().then((data) => {
      res.render('User/userProduct', {
         title_page: "user product",
         data: data
      })
   }).catch((err) => {
      console.log(err);
   });
};

exports.searchDataCont=(req,res)=>{
      const searchData=req.body.searchData;
     PrductModel.find({p_title:searchData}).then((data)=>{
      res.render('User/userProduct', {
         title_page: "Search data",
         data: data
      })
     }).catch((err)=>{
       console.log(err);
     })
};

exports.singleDataCont = (req, res) => {
   const s_id = req.params.s_id;
   PrductModel.findById(s_id).then((data) => {
      res.render('User/singleData', {
         title_page: "single data",
         data: data
      })
   }).catch(err => {
      console.log(err);
   })
};

exports.addToCartCont = (req, res) => {
   const p_id = req.body.p_id;
   const quantity = req.body.quantity;
   const user_id = req.user._id;

   const cartValue = [];
   CartModel.find({ user_id: user_id, p_id: p_id }).then((cartData) => {
      if (cartData === '') {
         PrductModel.findById(p_id).then((cartForData) => {
            cartValue.push(cartForData);
            const cart_data = new CartModel({
               p_id: p_id,
               quantity: quantity,
               user_id: user_id,
               cart: cartValue
            });
            cart_data.save().then(() => {
               console.log("Cart data is save");
               return res.redirect('/cartPage');
            }).catch((err) => {
               console.log(err);
            });
         }).catch((err) => {
            console.log(err);
         })
      } else {
         PrductModel.findById(p_id).then((cartForData) => {
            cartValue.push(cartForData);
            const cart_data = new CartModel({
               p_id: p_id,
               quantity: quantity,
               user_id: user_id,
               cart: cartValue
            });
            cart_data.save().then(() => {
               console.log("Cart data is save");
               return res.redirect('/cartPage');
            }).catch((err) => {
               console.log(err);
            });
         }).catch((err) => {
            console.log(err);
         })
      }
   });
};

exports.cartPageDisplay = (req, res) => {
   const userId = req.session.user._id;
   CartModel.find({ user_id: userId }).then((data) => {
      res.render('User/cartPage', {
         title_page: "Cart page",
         cartData: data
      })
   }).catch(err => {
      console.log(err);
   });
};

exports.deleteCartCont = (req, res) => {
   const c_del = req.params.c_del;
   CartModel.deleteOne({_id:c_del}).then(() => {
      res.redirect('/cartPage')
   }).catch((err) => {
      console.log(err);
   })
};
