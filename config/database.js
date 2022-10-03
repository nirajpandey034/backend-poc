require('dotenv').config();
let mongoose = require('mongoose');
const db = mongoose.connection;

const server = process.env.APP_DATABASE;

module.exports = function DBConnect() {
  mongoose
    .connect(server, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connection to database is established');
    })
    .catch(() => {
      console.log('Some error occurred');
    });
};
