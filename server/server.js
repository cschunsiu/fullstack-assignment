const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { isNil, isEmpty} = require('lodash');
const cache = require('memory-cache');
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');
const formidable = require('formidable');
const { converBase64ToImage } = require('convert-base64-to-image');

const app = express();
const googleClient = new vision.ImageAnnotatorClient({keyFilename: "../google-cloud.json"});
async function detectFaces(imagePath) {
    const results = await googleClient.faceDetection(imagePath);
    const faces = results[0].faceAnnotations;
    return {
        'Number of faces': faces.length,
        'Happy faces': faces.filter(face => face.joyLikelihood === 'VERY_LIKELY').length,
        'Anger faces': faces.filter(face => face.angerLikelihood === 'VERY_LIKELY').length,
        'Sad faces': faces.filter(face => face.sorrowLikelihood === 'VERY_LIKELY').length,
    };
}


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// get endpoint return webapp for init
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// API for login
app.post('/login', (req, res, next) => {
    const { username } = req.body;
    console.log('Login API received: ', username);

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
            const error = new Error('Error: Username already exists, please try again');
            error.status = 400;
            throw error;
        }

        // Generate JWT token
        const token = jwt.sign({ username }, 'jwtSecret', { expiresIn: '1800' });

        // Return JWT token to client
        res.json({
            token,
            username,
            model: {
                images: []
            }
        });
    } catch (error) {
        next(error);
    }
});

// API for image upload
app.post('/image', async (req, res, next) => {
    setTimeout(async () => {
        try {
            console.log('Image Upload API received.');
            const form = formidable({ multiples: true });
            let formFields = await new Promise((result, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    result(fields);
                });
            })

            const pathToSaveImage = './image.png'
            await converBase64ToImage(formFields.image, pathToSaveImage);
            const imageDetails = await detectFaces(pathToSaveImage);

            let data = cache.get('data');

            if (isEmpty(data)) {
                data[formFields.username] = {
                    images: []
                }
            }

            const userData = data[formFields.username];
            const template = {
                name: formFields.name,
                status: 100,
                data: []
            };
            userData.images.push(template);
            cache.put('data', data);

            res.json({data: {...imageDetails}});
        } catch (error) {
            next(error);
        }
    }, 5000);
});

// middleware for error
app.use((err, req, res, next) => {
    console.log('Error received with message: ', err.message);
    res.status(err.status || 500).send({message: err.message})
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});