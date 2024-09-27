const mongoose = require('mongoose');
const {Schema} = mongoose

const CartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
},
items: [{
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}]
});



module.exports = mongoose.model('Cart', CartSchema);

