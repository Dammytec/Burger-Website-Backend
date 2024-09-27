const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    imgSrc: {
      type: String,
      required: true,
    },
    title:{
        type: String,
        required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
   
  });

  const Products = mongoose.model('Products', productSchema)

  module.exports = Products