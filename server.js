const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Port for the backend server

// MongoDB connection URL and database/collection names
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'portfolio_db';
const collectionName = 'contact_messages';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// API endpoint to handle form submissions
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const submission = {
            name,
            email,
            subject,
            message,
            submittedAt: new Date()
        };

        const result = await collection.insertOne(submission);
        console.log('Form submission saved:', result.insertedId);

        await client.close();

        res.status(200).json({ success: true, message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, message: 'Error submitting form. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
