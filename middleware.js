const {artpieceSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Artpiece = require('./models/artpiece');


module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        // store the url thet are requesting
        req.session.returnTo = req.originalUrl; 
        req.flash('error', 'Please sign in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateArtpiece = (req, res, next) => {
    const { error } = artpieceSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const artpiece = await Artpiece.findById(id);
    if (!artpiece.owner.equals(req.user._id)) {
        req.flash('error', 'You have no permission to this operation');
        return res.redirect(`/artpieces/${id}`);
    }
    next();
}