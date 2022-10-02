const express = require('express');
const router = express.Router();
const productModel = require('../models/Product');

router.post('/add_product', async (request, response) => {
  const product = new productModel(request.body);

  try {
    await product.save();
    response.send(`${product.title} is added successfully`);
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

module.exports = router;
