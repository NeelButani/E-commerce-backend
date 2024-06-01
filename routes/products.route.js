const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getParticularProduct, updateProduct, deleteProduct, countProducts , getFeauturedProducts , uploadOptions , uploadMultiplePhotos} = require('../controllers/product.controller');

// to post a product
router.post(`/`, uploadOptions.single('image') , addProduct)

// to get all the product
router.get(`/`,getAllProducts);

// to get particular product
router.get(`/:id`,getParticularProduct);

// to update Product
router.put(`/:id`, uploadOptions.single('image') ,updateProduct)

// to delete a product
router.delete(`/:id`,deleteProduct)

// to count total number of products
router.get(`/get/count` , countProducts)

// to get featured products 
router.get(`/get/featured/:count`, getFeauturedProducts)

// to upload multiple photos
router.put(`/gallery-images/:id`,uploadOptions.array('images', 10) , uploadMultiplePhotos )
module.exports = router;