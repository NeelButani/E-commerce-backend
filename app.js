const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')

// Environment variable
const api = process.env.API_URL
const connectionString = process.env.CONNECTION_STRING


// Middleware
app.use(express.json());
app.use(morgan('tiny'))
app.use(cors())
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

// Routes 
const categoriesRoutes = require('./routes/categories.route')
const productsRoutes = require('./routes/products.route');
const userRoutes = require('./routes/users.route');
const orderRouter = require('./routes/orders.route');


app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/products`, productsRoutes );
app.use(`${api}/users`, userRoutes );
app.use(`${api}/orders`, orderRouter );

// Mongo db database connection 
mongoose.connect(connectionString).then(() => {
  console.log("Database is ready ...");
}).catch((err)=>{
  console.log(err);
})


// Starting the server
app.listen(3000,() =>{
  console.log(`Server started on PORT 3000`);
})

