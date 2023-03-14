const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client/dist/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});