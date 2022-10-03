const express = require('express');
const router = express.Router();
const productModel = require('../models/Product');
const role = require('../middleware/role');
const auth = require('../middleware/auth');

// get products
router.get('/get_products', async (request, response) => {
  try {
    await productModel
      .find({})
      .then((products) => {
        response.json({ products: products });
      })
      .catch((error) => {
        response.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

//get single product
router.post('/get_product', async (request, response) => {
  const product = new productModel(request.body);
  try {
    await productModel
      .findOne({ id: product.id })
      .then((product) => {
        response.json({ product: product });
      })
      .catch((error) => {
        response.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

// product addition
router.post('/add_product', role, auth, async (request, response) => {
  const product = new productModel(request.body);

  try {
    await product.save();
    response.send(`${product.title} is added successfully`);
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

//product deletion
router.delete('/delete_product', role, auth, async (request, response) => {
  const product = new productModel(request.body);

  try {
    await productModel
      .deleteOne({ id: product.id })
      .then((data) => {
        response.json({ msg: data });
      })
      .catch((error) => {
        response.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

//update product
router.put('/update_product', role, auth, async (request, response) => {
  const product = new productModel(request.body);

  const productObj = await productModel.findOne({ id: product.id });

  productObj.title = product.title ? product.title : productObj.title;
  productObj.description = product.description
    ? product.description
    : productObj.description;
  productObj.price = product.price ? product.price : productObj.price;

  try {
    await productObj
      .save()
      .then((data) => {
        response.json({ msg: `${productObj.title} is updated` });
      })
      .catch((error) => {
        response.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

module.exports = router;
