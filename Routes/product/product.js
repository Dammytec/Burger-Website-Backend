const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const Products = require('../../products')
const routes = express.Router()
 
// create new products 
routes.post('/create-products', async (req , res) => {
    try {
        const {imgSrc , title, time, price } = req.body
    const product = new Products({imgSrc , title, time, price})
    await product.save()
    res.status(200).send(product)
    } catch (error) {
        console.log(error);
        res.status(404).send({error: 'failed to create product'})
    }
})

routes.get('/read/:id' , async (req , res) => {
  try {
    const product = await Products.findById(req.params.id)
    if(!product) return res.status(404).json({error: 'product empty'})
        res.json(product)
  } catch(error){
    res.status(404).send({error: 'cannot read product of null'})
  }
})

routes.get('/get-products', async (req , res) => {
    try {
     const product = await Products.find()
     res.json(product)
    } catch (error){
        res.status(404).send({error:'cannot read properties of null'})
    }
})

routes.delete('/delete/:id', async (req, res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete the product' });
    }
});

routes.delete('/delete-all' , async (req , res) => {
    try {
     const product = await Products.deleteMany([])
     if( result.deletedCount === 0) return 
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete the product' });
    }
})

module.exports = routes