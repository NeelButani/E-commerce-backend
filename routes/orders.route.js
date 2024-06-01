const express = require('express');
const router = express.Router();
const {getOrders , postOrders , getParticularOrder , updateOrderStatus , deleteOrder , getTotalSales , getUsersOrder , getTotalOrders} = require('../controllers/orders.controller')


// to get all orders
router.get(`/`,getOrders);

// to post order
router.post(`/`,postOrders)

// to get particular order
router.get(`/:id`,getParticularOrder)

// to update the status of order
router.put(`/:id`,updateOrderStatus)

// to delete the order
router.delete(`/:id`,deleteOrder)

// to get total sales
router.get(`/get/totalSales`,getTotalSales)

// to get the user's order
router.get(`/get/userOrder/:userId`,getUsersOrder)

// to get total order
router.get(`/get/count`,getTotalOrders)

module.exports = router