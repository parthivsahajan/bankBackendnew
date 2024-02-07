const mongoose = require('mongoose');

// Connect to MongoDB
const connectionString = 'mongodb://localhost:27017/bank';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Perform further operations here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a model for the "users" collection
const userSchema = new mongoose.Schema({
  username: String,
  acno: Number,
  password: String,
  balance: Number,
  transactions: []
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};
