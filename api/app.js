const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

const path = require('path');
 
require('../src/config/db.config');
require('../src/routes/router');
app.use(cors());
app.use(bodyParser.json());
app.use('', require('../src/routes/router'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});