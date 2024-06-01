const { getAllusers , getParticularUser , adduser , updateUser , getCountUser , loginUser , deleteUser} = require('../controllers/users.controller');
const express = require('express');
const router = express.Router();

// to get all the users
router.get(`/`,getAllusers);

// to get a particular user
router.get(`/:id`,getParticularUser);

// to get a delete user
router.delete(`/:id`,deleteUser);

// to post the user 
router.post(`/`,adduser)

// to update a particular user
router.put(`/:id`,updateUser)

// to get count of user
router.get(`/get/count`,getCountUser)

// to login user and authentication
router.post(`/login`,loginUser)

module.exports = router