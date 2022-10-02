const express = require('express');
const router = express.Router();
const productModel = require('../models/Product');

// get products
router.get('/get_products', async (request, response) => {
  try {
    await productModel
      .find({})
      .then((products) => {
        response.json({ products: products });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

// product addition
router.post('/add_product', async (request, response) => {
  const product = new productModel(request.body);

  try {
    await product.save();
    response.send(`${product.title} is added successfully`);
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

//product deletion
router.delete('/delete_product', async (request, response) => {
  const product = new productModel(request.body);

  try {
    await productModel
      .deleteOne({ id: product.id })
      .then((data) => {
        response.json({ msg: data });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

module.exports = router;
