const {Category} = require('../models/category.model');



// To get all the category List
async function getAllCategory (req,res) {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
    return res.status(500).json({ success: false })
    }
    return res.status(200).json(categoryList)

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

// to get a particular category
async function getParticularCategory(req,res){

  try{
      let category = await Category.findById(req.params.id);
      if(!category){
        return res.status(500).json({
          success : false,
          message : "Category not found"
        })
      } 
      return res.status(200).json(category)
  } catch (error){
    console.error(error);
    return res.status(500).json({
      success : false,
      message : "Error in server"
    })
  }
}

// To Post the category
async function postCategory(req,res){
   
  try{
    const {name , icon , color} = req.body;
    let category = new Category({
        name : name,
        icon : icon,
        color : color
    });
    category = await category.save();

    if(!category){
      return res.status(404).json({
        message : "Category cannot be created"
      })
    }
    return res.status(200).json({
      category : category,
      message : "Category is successfully posted"
    })

  } catch(error){
     console.error(error);
     return res.status(500).json({
      success : false,
      message : error
     })
  }

}

// to delete a category
async function deleteCategory(req,res){
  try{
     const category = await Category.findByIdAndDelete(req.params.id);
     if(!category){
        return res.status(404).json({
          success : false,
          message : "Category not found"
        })
     }
    return res.status(200).json({
      success: true,
      message: "Category found and deleted"
    }) 

  } catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting category"
    });
  }
}

// to update a particular category
async function updateCategory(req , res){
  try{
     const {name , icon , color} = req.body; 
     let category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        icon: icon,
        color: color,
      },
      { new: true }
     );

     if(!category){
      return res.status(404).json({
        success : false,
        message : "Category was not upadated"
      })
     }

     return res.status(200).json({
      success : true,
      category : category
     })
     
  } catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating category"
    });
  }
}

module.exports = {
  getAllCategory , 
  postCategory , 
  deleteCategory , 
  getParticularCategory ,
  updateCategory
}