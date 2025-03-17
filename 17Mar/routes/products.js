var express = require('express');
var router = express.Router();
var productSchema = require('../schemas/product')
var categorySchema = require('../schemas/category')

/* GET products listing. */
router.get('/', async function(req, res, next) {
    let products = await productSchema.find({}).populate('category')
    res.status(200).send({
      success:true,
      data:products
    });
  });
  router.get('/:id', async function(req, res, next) {
    try {
      let id = req.params.id;
      let product = await productSchema.findById(id)
      res.status(200).send({
        success:true,
        data:product
      });
    } catch (error) {
      res.status(404).send({
        success:false,
        message:error.message
      });
    }
  });
  router.post('/', async function(req, res, next) {
    try {
      let body = req.body;
      let category = req.body.category
      let getCategory = await categorySchema.find({
        name:category
      })
      let newProduct = new productSchema({
        name:body.name,
        price:body.price?body.price:0,
        quantity:body.quantity?body.quantity:0,
        category:body.category,
      });
      await newProduct.save()
      res.status(200).send({
        success:true,
        data:newProduct
      });
    } catch (error) {
      res.status(404).send({
        success:false,
        message:error.message
      });
    }
  });
  router.put('/:id', async function(req, res, next) {
    try {
      let id = req.params.id;
      let product = await productSchema.findById(id);
      if(product){
        let body = req.body;
        if(body.name){
          product.name = body.name;
        }
        if(body.price){
          product.price = body.price;
        }
        if(body.quantity){
          product.quantity = body.quantity;
        }
        if(body.category){
          product.category = body.category;
        }
        await product.save()
        res.status(200).send({
          success:true,
          data:product
        });
      }else{
        res.status(404).send({
          success:false,
          message:"ID khomng ton tai"
        });
      }
    } catch (error) {
      res.status(404).send({
        success:false,
        message:error.message
      });
    }
  });
  router.delete('/:id', async function(req, res, next) {
    try {
      let id = req.params.id;
      let product = await productSchema.findById(id);
      if(product){
        product.isDeleted = true
        await product.save()
        res.status(200).send({
          success:true,
          data:product
        });
      }else{
        res.status(404).send({
          success:false,
          message:"ID khong ton tai"
        });
      }
    } catch (error) {
      res.status(404).send({
        success:false,
        message:error.message
      });
    }
  });

module.exports = router;
