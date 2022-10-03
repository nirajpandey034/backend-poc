const express = require('express');
require('dotenv').config();
const DBConnect = require('./config/database');

const productRoute = require('./routes/productsRoute');
const userRoute = require('./routes/usersRoute');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.APP_PORT || 3000;
app.use(express.json());

DBConnect(); //connection to db

app.use('/products', productRoute);
app.use('/users', userRoute);

app.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

app.use('/', function (req, res, next) {
  res.send('Home Route');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
