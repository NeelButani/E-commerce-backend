const {Order} = require('../models/order.model');
const { OrderItem } = require('../models/order-items.model');
const {Product} = require('../models/product.model');
const {Category} = require('../models/category.model');
const { populate } = require('dotenv');

// to get all the orders
async function getOrders(req,res){

  const orderList = await Order.find().populate('user' , 'name').sort({'dateOrdered' : -1});

  if(!orderList) {
     return res.status(500).json({success: false})
  } 
  return res.send(orderList);
}

// to get specific order
async function getParticularOrder(req,res){

  const order = await Order.findById(req.params.id)
  .populate('user' , 'name')
  .populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      populate: {
        path: 'category'
      }
    }
  })
  .sort({'dateOrdered' : -1});

  if(!order) {
     return res.status(500).json({success: false})
  } 
  return res.send(order);
}

// to post all the orders
async function postOrders(req,res){

  let totalPrice = 0;
  const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
    const newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
    });
    const savedOrderItem = await newOrderItem.save();
    const product = await Product.findById(orderItem.product);
    totalPrice += product.price * orderItem.quantity;

    return savedOrderItem._id;
}));


let order = new Order({
  orderItems: orderItemsIds,
  shippingAddress1: req.body.shippingAddress1,
  shippingAddress2: req.body.shippingAddress2,
  city: req.body.city,
  zip: req.body.zip,
  country: req.body.country,
  phone: req.body.phone,
  status: req.body.status,
  totalPrice: totalPrice,
  user: req.body.user,

});
order = await order.save();

if (!order) {
  return res.status(404).send("the order cannot be created");
}
res.send(order);
  
}

// to update the status
async function updateOrderStatus(req,res){
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status : req.body.status
    },
    {new : true}
  )

  if(!order){
    return res.status(400).send('The order status cannot be changed')
  }

  res.send(order)
}

// to delete a order
async function deleteOrder(req,res){
  try{
     const order = await Order.findByIdAndDelete(req.params.id);

    //  to delete the order items which are corresponding to that order
    if (order) {
     await order.orderItems.map(async (orderItem) => {
        const orderItemId = orderItem._id;
        await OrderItem.findByIdAndDelete(orderItemId);
      })
    }

     if(!order){
        return res.status(404).json({
          success : false,
          message : "order not found"
        })
     }
          
    return res.status(200).json({
      success: true,
      message: "order found and deleted"
    }) 

  } catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting order"
    });
  }
}

// to get total sales
async function getTotalSales(req,res){
  
  const totalSales = await Order.aggregate([
    {
      $group : {
        _id: null,
        totalSales : {
          $sum : '$totalPrice'
        }
      }
    }
  ])

  if(!totalSales) {
    return res.status(400).send("The order sales cannot be created")
  }

  res.send(totalSales[0])
}

// getting spefic user's orders
async function getUsersOrder(req,res){
  const userOrderList = await Order.find({ user : req.params.userId })
  .populate('user' , 'name')
  .populate({path : 'orderItems' , populate : 'product'})
  .sort({'dateOrdered' : -1});

  if(!userOrderList) {
     return res.status(500).json({success: false})
  } 
  return res.send(userOrderList);
}

// get total orders
async function getTotalOrders(req,res){
  try{
    const totalOrders = await Order.countDocuments();

    if(totalOrders){
     return  res.status(200).json(totalOrders)
    } 
    return res.status(500).json('Count not found')
  } catch(error){
    console.error(error);
  }
}


module.exports = {
  getOrders ,
  postOrders ,
  getParticularOrder ,
  updateOrderStatus ,
  deleteOrder ,
  getTotalSales ,
  getUsersOrder ,
  getTotalOrders
}