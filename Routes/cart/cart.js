const Cart = require('../../cart')
const express = require('express')
const routes = express.Router()
const authenticateToken = require('../authorisation/authorize')
const Products = require('../../products')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;

routes.post('/cart', authenticateToken, async (req, res) => {
     console.log('Authorization header:', req.headers['authorization']);
     const { productId, quantity } = req.body;
     const userId = req.user.userId;
 
     try {
         let cart = await Cart.findOne({ userId });
         if (!cart) {
             cart = new Cart({ userId, items: [] });
         }
 
         // Ensure productId is correctly assigned
         const existingItem = cart.items.find(item => item.productId.equals(productId));
         if (existingItem) {
             existingItem.quantity += quantity;
         } else {
             cart.items.push({ productId, quantity });
         }
 
         await cart.save();
         res.status(200).json(cart);
     } catch (err) {
         console.error("Error adding to cart:", err);
         res.status(500).json("Error adding to cart");
     }
 
});
 




routes.delete('/delete/:userId/:productId' , async (req , res) => {
    const { userId, productId } = req.params;

    try {
      // Find the cart associated with the userId
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json("Cart not found");
      }
  
      // Check if the item exists in the cart
      const itemExists = cart.items.some(
        (item) => item.productId.toString() === productId
      );
      if (!itemExists) {
        return res.status(404).json("Item not found in cart");
      }
  
      // Filter out the item with the given productId
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
  
      // Save the updated cart
      await cart.save();
  
      return res.status(200).json({ message: "Item successfully deleted from cart" });
    } catch (err) {
      console.error("Error deleting cart item:", err);
      return res.status(500).json("Error deleting cart item");
    }
})










routes.get("/read", authenticateToken, async (req, res) => {
    
    try {
        const userId = req.user.userId;
        console.log("Fetching all carts for userId:", userId);

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            model: 'Products' // Ensure this matches the model name exactly
        });

        if (!cart) {
            console.log("No cart found for userId:", userId);
            return res.status(404).json("No cart found");
        }

        console.log("Populated cart:", cart);
        return res.status(200).json(cart);
    } catch (err) {
        console.error("Error reading carts:", err);
        return res.status(500).json("Error reading carts");
    }
  });
  

  
  




module.exports = routes