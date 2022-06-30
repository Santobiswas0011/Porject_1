
const ProductModel = require('../Model/ProductModel');


exports.homepage = (req, res) => {
   res.render('Admin/home', {
      title_page: 'home page'
   })
};


exports.addProductDisplay = (req, res) => {
   res.render('Admin/addProduct', {
      title_page: "add product"
   })
};


exports.productDataCont = (req, res) => {
   const { p_title, p_price, p_desc } = req.body;
   const p_image = req.file.path;
   console.log(p_title, p_price, p_desc);
   const productData = new ProductModel({
      p_title: p_title,
      p_price: p_price,
      p_desc: p_desc,
      p_image: p_image
   });
   productData.save().then(() => {
      console.log("Data is successfully add");
      res.redirect('/product');
   }).catch((err) => {
      console.log(err);
   })
};


exports.productDisplay = (req, res) => {
   ProductModel.find().then((data) => {
      res.render('Admin/product', {
         title_page: 'porduct page',
         data: data
      })
   }).catch(err => {
      console.log(err);
   })
};


exports.editController = (req, res) => {
   const edit_id = req.params.edit_id;

   ProductModel.findById({ _id: edit_id }).then((data) => {
      res.render('Admin/editPage', {
         title_page: "edit page",
         data: data
      })
   }).catch((err) => {
      console.log(err);
   })

};


exports.editDataCont = (req, res) => {
   const { e_title, e_price, e_desc } = req.body;
   console.log(e_title, e_price, e_desc);
   const edit_id = req.body.edit_id;
   let e_image = '';
   const oldUrl = req.body.oldUrl;

   if (req.file === undefined) {
      e_image = oldUrl;
   } else {
      e_image = req.file.path;
   }

   ProductModel.findById(edit_id).then((up_data) => {
      up_data.p_title = e_title;
      up_data.p_price = e_price;
      up_data.p_desc = e_desc;
      up_data.p_image = e_image;

      return up_data.save().then(() => {
         console.log("Data is successfully edit");
         res.redirect('/product');
      }).catch((err) => {
         console.log(err);
      })
   }).catch(err => {
      console.log(err);
   })
};


exports.deleteController = (req, res) => {
   const delete_id = req.params.delete_id;

   ProductModel.deleteOne({ _id: delete_id }).then(() => {
      console.log("Successfully delete");
      res.redirect('/product')
   }).catch(err => {
      console.log(err);
   })
}
