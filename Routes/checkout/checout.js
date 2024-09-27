const express = require('express')
const routes = express.Router()
const Checkout = require('../../checkout')
const authenticateToken  = require('../authorisation/authorize')
// Create a new order (checkout)
routes.post('/checkout', authenticateToken, async (req, res) => {
    try {
        // Log the incoming request data
        console.log('Incoming request body:', req.body);

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            state,
            localGovArea,
            paymentMethod,
            cartId,
            totalAmount
        } = req.body;

        // Check for undefined fields
        console.log('firstName:', firstName);
        console.log('lastName:', lastName);
        console.log('phoneNumber:', phoneNumber);
        // Add other fields as needed

        const newOrder = new Checkout({
            userId: req.body.userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            state: req.body.state,
            localGovArea: req.body.localGovArea,
            paymentMethod: req.body.paymentMethod,
            cartId: req.body.cartId,
            totalAmount: req.body.totalAmount,
            status: 'pending'
        });

        const savedOrder = await newOrder.save();

        // Log the saved order
        console.log('Saved order:', savedOrder);
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('Error occurred:', err.message);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});



module.exports = routes