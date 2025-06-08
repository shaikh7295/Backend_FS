const express = require('express');
const Router = express.Router();
const multer = require('multer');

const { verifyAuth } = require('../middleware/auth.middleware');
const { registerUser } = require('../controller/registerUser.controller');
const { loginUser } = require('../controller/loginUser.controller');
const { graphETF } = require('../controller/graphETF.controller');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});
const upload = multer({ storage: storage });
 

Router.post('/register', upload.single('image'), registerUser);
Router.post('/login', loginUser);
Router.get('/portfolio/:tenure', graphETF);

Router.get('/healthCheck', (req, res) => {
    res.status(200).json({
        message: 'User authenticated successfully',
        user: {}
    });
}
);



module.exports = Router;