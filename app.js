const express = require('express');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const uploadRoute = require('./routes/upload');

require('dotenv').config();

const app = express();

app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to include user in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user; // Make user available to all views
    next();
});

// Set up EJS for templating
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);
app.use(documentRoutes);
app.use('/upload', uploadRoute);

// Default route
app.get('/', (req, res) => {
    res.redirect('/register');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
