const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model')
const mongoose = require('mongoose');
const multer = require('multer')

const FILE_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid Image Type');
    if(isValid){
      uploadError = null;
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ','-');
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })



// to add a new product
async function addProduct(req, res) {

  try {
  
    console.log("Neel",req.body.category);
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category"
      })
    }
    
   let file = req.file;
   if(!file){
    return res.status(400).json({
      success: false,
      message: "No image file found"
    })   
   }
   const fileName = file.filename;
   // http://localhost:3000/public/upload/image-12132
   const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) {
      return res.status(500).json({
        message: "Product was not created",
        success: false
      })
    }

    return res.status(200).json({
      success: true,
      product: product
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

// to get all the products , with or without category
// so when the category is passed , it should give the products of responding category
// without ctaegory , all products should be returned 
async function getAllProducts(req, res) {
  // ----This is query parameters
  // Example :- localhost:3000/api/v1/products?categories=2345,222

  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") }
    }

    let products = await Product.find(filter).populate("category")

    if (!products) {
      return res.status(500).json({
        success: false,
        message: "Products not found"
      })
    }

    return res.status(200).json(products)

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

// to get a particular product
async function getParticularProduct(req, res) {
  try {

    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found"
      })
    }

    return res.status(200).json(product)

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

// to update a particular product
async function updateProduct(req,res){

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("InValid Product ID");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found"
    })
  }
  
  const file = req.file;
  let imagePath;
  if(file){
    const fileName = file.filename;
    // http://localhost:3000/public/upload/image-12132
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`
    imagePath = `${basePath}${fileName}`
  } else {
    imagePath = product.image
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath ,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(500).send("the product cannot be updated");
  }
  res.send(updatedProduct);
}

// to delete a particular product
async function deleteProduct(req,res){
  try{
    let product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });     
    } 
    return res.status(200).json({
      success: true,
      message: " Product Found and deleted",
    });
  } catch(error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
}

// count of Products
async function countProducts(req,res){
    const productCount = await Product.countDocuments();

    if(!productCount){
      return res.status(500).json({
        success : false,
        message : "Count Not Found"
      })
    }
    return res.status(200).json(
     productCount
    )
}

// to get particular number of featured products
async function getFeauturedProducts(req,res){

   const count = req.params.count ? req.params.count : 0;
   const featuredProduct = await Product.find({
    isFeatured : true,
   }).limit(+count);

   if(!featuredProduct){
    return res.status(500).json({
      success : false,
      message : "Could not get featured products"
    })
   }

  return res.status(200).json(
    featuredProduct
  )
}

// uplaod multiple images 
async function uploadMultiplePhotos(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product ID");
  }

  let files = req.files; // Correct variable name

  if (files && files.length > 0) {
    let imagesPath = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`;

    files.forEach(file => { // Using forEach to iterate over files array
      imagesPath.push(`${basePath}/${file.filename}`); // Accessing filename property correctly
    });

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { images: imagesPath },
        { new: true }
      );

      if (!product) {
        return res.status(500).send("The product cannot be updated");
      }

      return res.send(product);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    return res.status(400).send("No files uploaded");
  }
}


module.exports = {
  addProduct,
  getAllProducts,
  getParticularProduct ,
  updateProduct ,
  deleteProduct ,
  countProducts ,
  getFeauturedProducts , 
  uploadOptions ,
  uploadMultiplePhotos
}