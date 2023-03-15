const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { isNil } = require('lodash');
const cache = require('memory-cache');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// middleware for error
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message
    });
});

// get endpoint return webapp for init
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// API for login
app.post('/login', (req, res, next) => {
    const { username } = req.body;

    try {
        let data = cache.get('data');

        // TODO should use singleton pattern instead
        if (isNil(data)) {
            data = {};
        }

        if (!Object.keys(data).includes(username)) {
            data[username] = {
                images: []
            }
            cache.put('data', data);
        } else {
            const error = new Error('Error: not able to login with the same username');
            error.status = 400;
            throw error;
        }

        // Generate JWT token
        const token = jwt.sign({ username }, 'jwtSecret', { expiresIn: '1800' });

        // Return JWT token to client
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

// API for image upload
app.post('/image', (req, res, next) => {
    const { username, image } = req.body;

    try {
        setTimeout(() => {
            let data = cache.get('data');

            // TODO should use singleton pattern instead
            if (isNil(data)) {
                data = [];
            }

            // Return JWT token to client
            res.json({ });
        }, 5000);
    } catch (error) {
        next(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});