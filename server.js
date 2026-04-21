const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to Database!'))
  .catch(err => console.error('Connection error:', err));

const Appointment = mongoose.model('Appointment', {
  name: String,
  email: String,
  device: String,
  issue: String,
  date: Date
});

app.post('/api/book', async (req, res) => {
  try {
    const booking = new Appointment(req.body);
    await booking.save();
    res.status(201).send({ message: "Booking successful!" });
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
