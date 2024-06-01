const express = require('express');
const router = express.Router();
const {getAllCategory , postCategory , deleteCategory , getParticularCategory , updateCategory} = require('../controllers/categories.controller')

// to get list of categories
router.get(`/`,getAllCategory);


// to post a category
router.post(`/`,postCategory);

// to delete a category 
router.delete(`/:id`, deleteCategory)

// to get a particular category
router.get(`/:id`, getParticularCategory)

// to update a particular category
router.put(`/:id`, updateCategory )
module.exports = router;