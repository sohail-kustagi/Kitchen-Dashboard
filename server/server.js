const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Dish = require('./models/Dish');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS Configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors({
  origin: clientUrl
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Real-time Watcher
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Setting up change stream watcher...');
  // Watch the 'dishes' collection for any changes
  const dishChangeStream = connection.collection('dishes').watch();

  dishChangeStream.on('change', (change) => {
    console.log('Dish collection changed:', change.operationType);
    // Emit event to all connected clients
    io.emit('dishesUpdated');
  });
});

// Routes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/dishes/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    // Find by dishId (string) as defined in schema
    const dish = await Dish.findOne({ dishId: id });
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    dish.isPublished = !dish.isPublished;
    await dish.save();
    
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
