const express = require('express');
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Route to handle document upload
router.post('/upload', upload.single('document'), documentController.uploadDocument);

// Route to handle document deletion
router.post('/documents/delete/:id', documentController.deleteDocument);

router.get('/home', documentController.getHome);

module.exports = router;