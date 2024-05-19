const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));


// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            const notes = JSON.parse(data);
            notes.push(newNote);

            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to save note' });
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
