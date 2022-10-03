const express = require('express');
const router = express.Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

// get users
router.get('/get_users', async (request, response) => {
  try {
    await userModel
      .find({})
      .then((users) => {
        response.json({ users: users });
      })
      .catch((error) => {
        response.json({ error: error });
      });
  } catch (error) {
    response.status(500).send('Error Occured: ' + error.message);
  }
});

//get single product
// router.post('/get_product', async (request, response) => {
//   const product = new productModel(request.body);
//   try {
//     await productModel
//       .findOne({ id: product.id })
//       .then((product) => {
//         response.json({ product: product });
//       })
//       .catch((error) => {
//         response.json({ error: error });
//       });
//   } catch (error) {
//     response.status(500).send('Error Occured: ' + error.message);
//   }
// });

// user registration
router.post('/register_user', async (request, response) => {
  try {
    // getting input
    const { firstName, lastName, email, password, phoneNumber } = request.body;

    //validation
    if (!(email && password && firstName && lastName && phoneNumber)) {
      response.status(400).send('All input is required');
    }
    //checking existing user
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return response.status(409).send('User Already Exist. Please Login');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      firstName,
      lastName,
      phoneNumber,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '1h',
      }
    );

    // return new user
    response.status(201).json({ token: token, success: true });
  } catch (err) {
    console.log(err);
  }
});

// user login
router.post('/login_user', async (request, response) => {
  try {
    // getting input
    const { email, password } = request.body;

    //validation
    if (!(email && password)) {
      response.status(400).send('All input is required');
    }
    // getting password from db and comparing it
    const user = await userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '1h',
        }
      );

      // user
      response.status(200).json({ token: token, success: true });
    }
    response.status(400).json({ success: false });
  } catch (err) {
    console.log(err);
  }
});

// //product deletion
// router.delete('/delete_product', async (request, response) => {
//   const product = new productModel(request.body);

//   try {
//     await productModel
//       .deleteOne({ id: product.id })
//       .then((data) => {
//         response.json({ msg: data });
//       })
//       .catch((error) => {
//         response.json({ error: error });
//       });
//   } catch (error) {
//     response.status(500).send('Error Occured: ' + error.message);
//   }
// });

// //update product
// router.put('/update_product', async (request, response) => {
//   const product = new productModel(request.body);

//   const productObj = await productModel.findOne({ id: product.id });

//   productObj.title = product.title ? product.title : productObj.title;
//   productObj.description = product.description
//     ? product.description
//     : productObj.description;
//   productObj.price = product.price ? product.price : productObj.price;

//   try {
//     await productObj
//       .save()
//       .then((data) => {
//         response.json({ msg: `${productObj.title} is updated` });
//       })
//       .catch((error) => {
//         response.json({ error: error });
//       });
//   } catch (error) {
//     response.status(500).send('Error Occured: ' + error.message);
//   }
// });

module.exports = router;
