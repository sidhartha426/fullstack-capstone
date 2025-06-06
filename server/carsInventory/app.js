/*jshint esversion: 8 */

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3050;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const carsData = JSON.parse(fs.readFileSync('car_records.json', 'utf8'));

const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASS;

mongoose.connect(`mongodb://${dbUser}:${dbPass}@mongo_db:27017/`, { dbName: 'dealershipsDB' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const Cars = require('./inventory');

try {

  Cars.deleteMany({}).then(() => {
    Cars.insertMany(carsData.cars);
  });
} catch (error) {
  console.error(error);
  // Handle errors properly here
}

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});



app.get('/cars/:id', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.get('/carsbymake/:id/:make', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id, make: req.params.make});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews by car make and model' });
  }
});

app.get('/carsbymodel/:id/:model', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, model: req.params.model });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by ID' });
  }
});

app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  try {
    let mileage = parseInt(req.params.mileage)
    let condition = {}
    if(mileage === 50_000) {
      condition = { $lte : mileage}
    } else if (mileage === 100_000){
      condition = { $lte : mileage, $gt : 50_000}
    } else if (mileage === 150_000){
      condition = { $lte : mileage, $gt : 100_000}
    } else if (mileage === 200_000){
      condition = { $lte : mileage, $gt : 150_000}
    } else {
      condition = { $gt : 200_000}
    }
    const documents = await Cars.find({ dealer_id: req.params.id, mileage : condition });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by ID' });
  }
});


app.get('/carsbyprice/:id/:price', async (req, res) => {
    try {
        let price = parseInt(req.params.price)
        let condition = {}
        if(price === 20_000) {
          condition = { $lte : price}
        } else if (price=== 40_000){
          console.log("\n \n \n "+ price)  
          condition = { $lte : price, $gt : 20_000}
        } else if (price === 60_000){
          condition = { $lte : price, $gt : 40_000}
        } else if (price === 80_000){
          condition = { $lte : price, $gt : 60_000}
        } else {
          condition = { $gt : 80_000}
        }
        const documents = await Cars.find({ dealer_id: req.params.id, price : condition });
        res.json(documents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers by ID' });
      }
});



app.get('/carsbyyear/:id/:year', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, year : { $gte :req.params.year }});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by ID' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});