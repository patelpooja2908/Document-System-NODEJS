// controllers/documentController.js

const Document = require('../models/Document');

exports.getHome = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    try {
        const documents = await Document.find({ user: req.session.user._id });
        res.render('home', { user: req.session.user, documents });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

exports.uploadDocument = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const document = new Document({
            user: req.session.user._id,
            originalname: req.file.originalname,
            filename: req.file.filename,
        });
        await document.save();
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
};

exports.deleteDocument = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        await Document.findByIdAndDelete(req.params.id);
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
};
