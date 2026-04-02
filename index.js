const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Could not connect:", err));

// 2. Data Model
const Person = mongoose.model('Person', { 
    name: String, 
    email: String, 
    age: Number 
});

// 3. ROUTES

// WELCOME (Home)
app.get('/', (req, res) => {
    res.send("Welcome to my People API! Use /people to see the data.");
});

// CREATE (Add a person)
app.post('/people', async (req, res) => {
    try {
        const newPerson = new Person(req.body);
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ ALL (Get everyone)
app.get('/people', async (req, res) => {
    const allPeople = await Person.find();
    res.json(allPeople);
});

// READ ONE (Get one person by ID)
app.get('/people/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: "Person not found" });
        res.json(person);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE (Change a person's info)
app.put('/people/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // This returns the person *after* the changes are made
        );
        res.json(updatedPerson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE (Remove a person)
app.delete('/people/:id', async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.json({ message: "Person deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));