const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// add tag for selection, when search, search the tag only
// modify the type for price allowing allowing for marking sold or number only

//https://res.cloudinary.com/dkf9c4dgi/image/upload/w_200/v1670535218/EverythingArt/gcodweaefeyzg9cyapfa.avif
const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const ArtpieceSchema = new Schema({
    title: String,
    artist: String,
    images: [ImageSchema],
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contactPhone: String
    // genre: String
});

module.exports = mongoose.model('Artpiece', ArtpieceSchema);