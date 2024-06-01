const { User } = require('../models/user.model');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")


// to get all the User
async function getAllusers(req,res){
  try{
    // console.log(hello);
    const userList = await User.find().select("-passwordHash");
    if(!userList){
      return res.status(500).json({
        success : false ,
        message : "No list of  user found"
      })
    }
    return res.status(200).json(userList)
  } catch(error){
    console.error(error);
  }
}

// to get a particular user
async function getParticularUser(req,res){
  const user = await  User.findById(req.params.id).select("-passwordHash");
  if(!user){
    return res.status(500).json({
      success : false,
      message : "User not Found"
    })
  }
  return res.status(200).json(user
  )
}

// to post a user
async function adduser(req,res){

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street : req.body.street,
    apartment : req.body.apartment,
    zip : req.body.zip,
    city : req.body.city,
    country : req.body.country,

  });

  user = await user.save();

  if(!user){
    return res.status(404).json({
      success : false,
      message : "User cannot be created"
    })
  }

  return res.status(200).json(user)
}

// to update a particular product
async function updateUser(req,res){
    // if user gives password while upadating or not
    // if gives update with new , or else
    // or take the old one and update

  const userExist = await User.findById(req.params.id);
  if(!userExist){
    console.log("User does not exists");
  }

  let newPassword
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10)
  } else {
    newPassword = userExist.passwordHash
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street : req.body.street,
      apartment : req.body.apartment,
      zip : req.body.zip,
      city : req.body.city,
      country : req.body.country,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success : false,
      message : "User cannot be updated"
    });
  }
  return res.status(200).json({
    success : true,
    user : user
  })
}

// Count of user
async function getCountUser(req,res){

  const userCount = await User.countDocuments();
  if(!userCount){
     return res.status(500).json({
      success : false
     })
  }
  return res.status(200).json(
    userCount )

}

// To authenticate user i.e login 
async function loginUser(req,res){
  const user = await User.findOne({email : req.body.email})
  const secret = process.env.secret;
  if(!user){
      return res.status(400).send('The user not found')
  }
  
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign({
          userId: user.id,
          isAdmin:user.isAdmin
      }, secret,
      {expiresIn : '1d' }
      )
      
      res.status(200).send({
          user: user.email,
          token: token
      })
  } else {
      return res.status(400).send("Password is Wrong!")
  }
}

// To delete the user
async function deleteUser(req,res){
  try{
     const user = await User.findByIdAndDelete(req.params.id);
     if(!user){
        return res.status(404).json({
          success : false,
          message : "User not found"
        })
     }
    return res.status(200).json({
      success: true,
      message: "User found and deleted"
    }) 

  } catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting User"
    });
  }
}

module.exports = {
  getAllusers , 
  getParticularUser ,
  adduser ,
  updateUser , 
  getCountUser ,
  loginUser,
  deleteUser
}