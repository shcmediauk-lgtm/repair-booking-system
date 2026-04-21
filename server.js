const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('DB Connected'))
  .catch(err => console.error('DB Error:', err));

const Appointment = mongoose.model('Appointment', {
  name: String, email: String, device: String, issue: String, date: Date
});

// Hostinger Email Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/book', async (req, res) => {
  try {
    const booking = new Appointment(req.body);
    await booking.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'support@mpcdoctor.com', 
      subject: `New Repair Request: ${req.body.name}`,
      text: `Device: ${req.body.device}\nIssue: ${req.body.issue}\nDate: ${req.body.date}`
    };

    await transporter.sendMail(mailOptions);
    res.status(201).send({ message: "Success" });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running`));
