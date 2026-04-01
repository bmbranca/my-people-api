const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); // This allows the API to read JSON data sent to it

// 1. Connect to MongoDB using the secret link in your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Could not connect:", err));

// 2. Define what a "Person" looks like
const Person = mongoose.model('Person', { 
    name: String, 
    email: String, 
    age: Number 
});

// 3. The "Welcome" route
app.get('/', (req, res) => {
    res.send("Welcome to my People API!");
});

// 4. Route to GET all people
app.get('/people', async (req, res) => {
    const allPeople = await Person.find();
    res.json(allPeople);
});

// 5. Route to ADD a new person
app.post('/people', async (req, res) => {
    const newPerson = new Person(req.body);
    await newPerson.save();
    res.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));