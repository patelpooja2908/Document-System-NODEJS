// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getRegister = (req, res) => {
    res.render('register', { title: 'Register' }); // Ensure title or any additional data is passed if needed
};

exports.postRegister = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.redirect('/register'); // Redirect back to register if user exists
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
};

exports.getLogin = (req, res) => {
    res.render('login', { title: 'Login' }); // Ensure title or any additional data is passed if needed
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user; // Store user in session
            res.redirect('/home');
        } else {
            res.redirect('/login'); // Redirect back to login on failure
        }
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect('/home'); // Redirect to home if error occurs during logout
        }
        res.redirect('/login');
    });
};
