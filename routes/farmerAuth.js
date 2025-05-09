const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');

router.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber, location } = req.body;

  try {
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newFarmer = new Farmer({ name, email, password, phoneNumber, location });
    await newFarmer.save();
    res.status(201).json({ message: "Farmer registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const farmer = await Farmer.findOne({ email });
      console.log("🧑‍🌾 Farmer found:", farmer);
      if (!farmer || farmer.password !== password) {
        console.log("❌ Invalid login attempt");
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      res.status(200).json({ message: "Login successful", farmer });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
