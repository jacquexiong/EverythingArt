const express = require('express');
const router = express.Router();
const artpieces = require('../controllers/artpieces');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateArtpiece} = require('../middleware');
const multer = require('multer'); //npm i multer, https://github.com/expressjs/multer
const {storage} = require('../cloudinary')
const upload = multer({storage}); 

router.route('/')
    .get(catchAsync(artpieces.index))
    .post(isLoggedIn, upload.array('image'), validateArtpiece, catchAsync(artpieces.createArtpiece));

router.get('/new', isLoggedIn, artpieces.renderNewForm);
router.get('/search', catchAsync(artpieces.search));

router.route('/:id')
    // .get(catchAsync(artpieces.showArtpiece))
    .get(isLoggedIn, catchAsync(artpieces.showPicture))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateArtpiece, catchAsync(artpieces.updateArtpiece))
    .delete(isLoggedIn, isAuthor, catchAsync(artpieces.deleteArtpiece));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(artpieces.renderEditForm));

// router.get('/', catchAsync(artpieces.index));
// router.get('/new', isLoggedIn, artpieces.renderNewForm);
// router.post('/', isLoggedIn, validateArtpiece, catchAsync(artpieces.createArtpiece));
// router.get('/:id',isLoggedIn, catchAsync(artpieces.showArtpiece));
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(artpieces.renderEditForm));
// router.put('/:id', isLoggedIn, isAuthor, validateArtpiece, catchAsync(artpieces.updateArtpiece));
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(artpieces.deleteArtpiece));

module.exports = router;