const Artpiece = require('../models/artpiece');

const {cloudinary} = require("../cloudinary")

const imagesLoaded = require('imagesloaded');
const $ = require('jquery');
// imagesLoaded.makeJQueryPlugin( $ );

// const url = 'https://api.unsplash.com/';
// const key = 'client_id='+process.env.Unsplash_AccessKey; 

// https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY
// https://api.unsplash.com/photos?query=cat&client_id=PuQTzmYS42Ip-8dRgz84AKYiRgQ1c_K1ZOtg7tXogeI

// from Unsplash
const { createApi } = require('unsplash-js');
const { response } = require('express');
const unsplash = createApi({
    accessKey: process.env.Unsplash_AccessKey
});
console.log(unsplash);

const firstLetterUpper = (str1, str2) => {
    const arr = [str1, str2];
    const newArr = arr.map(item => item === null ? '' : item);
    const longest = newArr.reduce(
        function (a, b) {
            return a.length > b.length ? a : b;
        }
    );

    // console.log(longest);
    if (longest === '') {
        return 'Untitled';
    }

    const titleCase = longest.toLowerCase().split(' ').map(function(word) { 
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  
    return titleCase;
}

module.exports.search = async(req, res) => {
    const searchTerm = req.query.query;
    try {
        const photos = await unsplash.search.getPhotos({ query: searchTerm, page: 1, perPage: 18});
        if (photos.status!==200) {
            req.flash('error', 'No results found');
            throw new ReferenceError('Failed to fetch data');
        }
        const results = photos.response?.results;
        // console.log('first');
        // console.log(results[0]);
        const artpieces = await Artpiece.find({title: new RegExp(searchTerm, 'i')});
        console.log(artpieces);
        res.render('artpieces/search', {searchTerm, results, artpieces, firstLetterUpper}); 
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/artpieces');
    }
    
}



// from both
module.exports.showPicture = async(req, res) => {
    console.log(req.params.id); // is the real id for photo fetch
    const result = await unsplash.photos.get({photoId: req.params.id});
    console.log(result);
    if (result.status===200) {
        const photo = result.response;
        console.log(photo);
        return res.render('artpieces/showPhoto', { photo, firstLetterUpper });
    } else {
        const artpiece = await Artpiece.findById(req.params.id).populate('owner');
        if (!artpiece) {        
            req.flash('error', 'Cannot find the artpiece');
            return res.redirect('/artpieces');
        }
        res.render('artpieces/show', {artpiece});
    }
}



module.exports.index = async(req, res) => {
    const artpieces = await Artpiece.find({});
    try{
        const photos = await unsplash.photos.list({
            page: 2,
            per_page: 15,
        });
        console.log(photos);
        if (photos.status===200) {
            const results = photos.response?.results;
            console.log(results);
            console.log('showing first');
            console.log(results[0]);
            return res.render('artpieces/index', { artpieces, results, firstLetterUpper }) // render to the file view
        }
    } catch(e) {
        console.log('catch')
        req.flash('error', 'fetch failed, showing artpieces from database only');
        const results = [];
        return res.render('artpieces/index', { artpieces, results, firstLetterUpper })
    }
    
    
}

// this function works for mongodb only
module.exports.showArtpiece = async(req, res) => {
    const artpiece = await Artpiece.findById(req.params.id).populate('owner');
    if (!artpiece) {        
        req.flash('error', 'Cannot find the artpiece');
        return res.redirect('/artpieces');
    }
    res.render('artpieces/show', {artpiece});
}

// from MongoDB
// module.exports.collectionIndex = async(req, res) => {
//     console.log(req.user._id);
//     const artpieces = await Artpiece.find({"owner": req.user._id});
//     console.log(artpieces);
//     res.render('users/collectionIndex', { artpieces })
// }

module.exports.renderNewForm = (req, res) => {
    res.render('artpieces/new');
}

 module.exports.createArtpiece = async(req, res, next) => {
    const artpiece = new Artpiece(req.body.artpiece);
    artpiece.owner = req.user._id;
    artpiece.images = req.files.map(f=>({ url: f.path, filename: f.filename }));
    await artpiece.save();
    console.log(artpiece);
    req.flash('success', 'You just successfully uploaded your artpiece!');
    res.redirect(`/artpieces/${artpiece._id}`);
}




module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const artpiece = await Artpiece.findById(id);
    if (!artpiece) {
        req.flash('error', 'Cannot find the artpiece');
        return res.redirect('/artpieces');
    }
    res.render('artpieces/edit', {artpiece});
}

module.exports.updateArtpiece = async(req, res) => {
    const {id} = req.params;
    const artpiece = await Artpiece.findByIdAndUpdate(id, {...req.body.artpiece});
    const imgs = req.files.map(f=>({ url: f.path, filename: f.filename }));
    console.log(req.body.artpiece.sold);
    artpiece.sold = Boolean(req.body.artpiece.sold);
    // console.log(req.body.status);
    // artpiece.sold = req.body.status;
    console.log(artpiece.sold);
    artpiece.images.push(...imgs);
    await artpiece.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await artpiece.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(artpiece)
    }
    console.log(artpiece);
    req.flash('success', 'You just successfully updated your artpiece!');
    res.redirect(`/artpieces/${artpiece._id}`);
}


module.exports.deleteArtpiece = async(req, res) => {
    const {id} = req.params;
    await Artpiece.findByIdAndDelete(id);
    req.flash('success', 'You just successfully removed your artpiece!');
    res.redirect('/artpieces');
}