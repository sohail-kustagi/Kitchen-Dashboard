const mongoose = require('mongoose');
const Dish = require('./models/Dish');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const importData = async () => {
  try {
    // Read the JSON file
    const jsonString = fs.readFileSync('./data.json', 'utf-8');
    const dishes = JSON.parse(jsonString);

    // Clear existing data to avoid duplicates
    await Dish.deleteMany();
    console.log('Old data cleared...');

    // Insert new data
    await Dish.insertMany(dishes);
    console.log('Data Imported Successfully!');

    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();