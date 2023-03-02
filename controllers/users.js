const User = require('../models/user');
const Artpiece = require('../models/artpiece');
const blankUserProfile = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
// const Masonry = require('masonry-layout');

// from Unsplash
const { createApi } = require('unsplash-js');
const unsplash = createApi({
    accessKey: process.env.Unsplash_AccessKey
});

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
    try{
        const {email, fullname, username, password, bio, location} = req.body;
        const user = new User({email, username, fullname, bio, location});
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Everything Art!');
        res.redirect('/login');
        // req.login(registeredUser, err => {
        //     if (err) return next(err);
        //     req.flash('success', 'Welcome to Everything Art!');
        //     res.redirect('/artpieces');
        // })  
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }    
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/artpieces';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const firstLetterUpper = (str1, str2) => {
    const arr = [str1, str2];
    const newArr = arr.map(item => item === null ? '' : item);

    // console.log(newArr)

    const longest = newArr.reduce(
        function (a, b) {
            return a.length > b.length ? a : b;
        }
    );

    console.log(longest);
    if (longest === '') {
        return 'Untitled';
    }

    const titleCase = longest.toLowerCase().split(' ').map(function(word) { 
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  
    return titleCase;
        
}

module.exports.renderProfile = async(req, res) => {
    // for api profile
    console.log(req.params); // req.params is access from ejs href link
    const apiUsername = req.params.id;
    console.log(apiUsername);
    try{
        const photos = await unsplash.users.getPhotos({
            username: apiUsername,
            page: 1,
            perPage: 12,
            orderBy: 'latest',
        });
        if (photos.status===200) {
            const results = photos.response?.results;
            console.log(results);
            return res.render('users/profile', {results, firstLetterUpper});
        }
        // to database find user 
        else {
            const dbUser = await User.findById(req.params.id);
            console.log('found db user');
            console.log(dbUser);
            if (!dbUser) {        
                req.flash('error', 'Cannot find the user');
                return res.redirect('/artpieces');
            }
            const artpieces = await Artpiece.find({});
            return res.render('users/dbprofile', {dbUser, artpieces, blankUserProfile});
        }
    }catch(e) {
        req.flash('error', e.message);
        res.redirect('/artpieces');
    }
    
}

module.exports.renderSetting = (req, res) => {
    res.render('users/settings', {blankUserProfile}); // to the ejs
}

module.exports.updateSetting = async(req, res) => {
    const {id} = req.user;
    console.log({id});
    const {newName, fullname, newEmail, newLocation, newBio} = req.body;
    const user = await User.findByIdAndUpdate({_id: id}, {email: newEmail, username: newName, fullname: fullname, location: newLocation, bio: newBio});
    // const image = req.files.map(f=>({ url: f.path, filename: f.filename }));
    // user.profileImage.push(...image);
    // await user.save();
    // if (req.body.deleteImages) {
    //     for (let filename of req.body.deleteImages) {
    //         await cloudinary.uploader.destroy(filename);
    //     }
    //     await user.updateOne({$pull: {profileImage: {filename: {$in: req.body.deleteImages}}}});
    //     console.log(user)
    // }
    console.log(user);
    req.flash('success', 'You just successfully updated your information, please log in again!');
    res.redirect('/login');
}

// from MongoDB
module.exports.collectionIndex = async(req, res) => {
    console.log(req.user._id);
    const artpieces = await Artpiece.find({"owner": req.user._id});
    console.log(artpieces);
    res.render('users/collectionIndex', { artpieces })
}

module.exports.logout = (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash('success', 'You are logged out');
        res.redirect("/artpieces");
      });
}

