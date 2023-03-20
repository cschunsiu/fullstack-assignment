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
const googleClient = new vision.ImageAnnotatorClient({keyFilename: path.join(__dirname, "../google-cloud.json")});
async function detectFaces(imagePath) {
    const results = await googleClient.faceDetection(imagePath);
    const faces = results[0].faceAnnotations;
    return {
        'Number of faces': faces.length,
        'Happy faces': faces.filter(face => face.joyLikelihood === 'VERY_LIKELY' || face.joyLikelihood === 'LIKELY').length,
        'Anger faces': faces.filter(face => face.angerLikelihood === 'VERY_LIKELY' || face.angerLikelihood === 'LIKELY').length,
        'Sad faces': faces.filter(face => face.sorrowLikelihood === 'VERY_LIKELY' || face.sorrowLikelihood === 'LIKELY').length,
    };
}
const AUTH_TYPE = {
    SIGN_UP: 'sign-Up',
    SIGN_IN: 'sign-In'
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// get endpoint return webapp for init
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// API for login
app.post('/auth', (req, res, next) => {
    const { username, type } = req.body;
    console.log('Auth API received: ', username, type);

    try {
        // TODO should use singleton pattern instead
        // get data from memory
        let data = cache.get('data');
        if (isNil(data)) {
            data = {};
        }

        // if trying to sign up but username exist, throw error
        if (type === AUTH_TYPE.SIGN_UP && Object.keys(data).includes(username)) {
            const error = new Error('Error: Username already exists, please try again');
            error.status = 400;
            throw error;
        }

        // if trying to sign in but nothing comes up
        if (type === AUTH_TYPE.SIGN_IN && !Object.keys(data).includes(username)) {
            const error = new Error(`Error: Username doesn't exists, please try again`);
            error.status = 400;
            throw error;
        }

        let profileInfo = data[username];
        if (isEmpty(profileInfo)) {
            profileInfo = {
                images: []
            }
            data[username] = profileInfo;
            cache.put('data', data);
        }

        // Generate JWT token
        const token = jwt.sign({ username }, 'jwtSecret', { expiresIn: '1800' });

        // Return JWT token to client
        res.json({
            username,
            token,
            ...profileInfo
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
            // parse formData
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

            // put image into Google API
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
                data: imageDetails
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