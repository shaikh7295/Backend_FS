const express = require('express');
const Router = express.Router();
const multer = require('multer'); 

const { verifyAuth } = require('../middleware/auth.middleware');
const { registerUser } = require('../controller/registerUser.controller');
const { loginUser } = require('../controller/loginUser.controller');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save in uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // or use unique name with Date.now()
    }
});
const upload = multer({ storage: storage });
 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



Router.post('/register', upload.single('image'), registerUser);
Router.post('/login', loginUser);

Router.get('/healthCheck', (req, res) => {
    res.status(200).json({
        message: 'User authenticated successfully',
        user: {}
    });
}
);



module.exports = Router;