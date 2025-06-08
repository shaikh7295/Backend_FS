const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobileNumber, dob } = req.body;
        const image = req.file.originalname 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            mobileNumber,
            dob,
            image
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Registration failed.', error });
    }
};
