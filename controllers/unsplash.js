// const { createApi } = require('unsplash-js');
// const { search } = require('../routes/artpieces');
// const url = 'https://api.unsplash.com/';
// const key = 'client_id='+process.env.Unsplash_AccessKey; 

// // https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY
// // https://api.unsplash.com/photos?query=cat&client_id=PuQTzmYS42Ip-8dRgz84AKYiRgQ1c_K1ZOtg7tXogeI

// const unsplash = createApi({
//     accessKey: process.env.Unsplash_AccessKey
// });

// console.log(unsplash);

// module.exports.apifetch = async(req, res) => {
//     const searchTerm = req.query.query;
//     const photos = await unsplash.search.getPhotos({ query: searchTerm, page: 3, perPage: 20});
//     // console.log(JSON.stringify(photos, null, 2));
//     const results = photos.response?.results;
//     console.log('first');
//     console.log(results[0]);
//     res.render('artpieces/search', {searchTerm, results}); 
// }

// module.exports.showPicture = async(req, res) => {
//     console.log(req.params.id); // is the real id for photo fetch
//     const result = await unsplash.photos.get({photoId: req.params.id});
//     const photo = result.response;
//     console.log(photo);
//     res.render('artpieces/showPhoto', {photo});
// }