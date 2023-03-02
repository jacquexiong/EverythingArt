const mongoose = require('mongoose');
// const SweeptakesModel = mongoose.model(Constants.SWEEPTAKES,sweepstakesSchema);
// SweeptakesModel.find( { enabled : { $exists : false } }).then(
// function(doc){
//        doc.enabled = false;
//        doc.save();
//     }
// )
const Artpiece = require('../models/artpiece');

mongoose.connect('mongodb://localhost:27017/artpiece', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async() => {
    await Artpiece.deleteMany({});
    const colors = ["Purple", "Blue", "Yellow"]; 
    for (let i = 0; i < 3; i++) {
        const art = new Artpiece({
            title: `${colors[i]} Rain`, 
            artist: 'Jessie Fan', 
            description: 'Inspired by the beauty of an erased chalkboard and its countless smudged layers',
            owner: '6398f212b582364110290c94',
            images: [
                {
                  url: 'https://res.cloudinary.com/dkf9c4dgi/image/upload/v1670527039/EverythingArt/yhkl9z8qjmekg2k68vnw.avif',
                  filename: 'EverythingArt/yhkl9z8qjmekg2k68vnw',
                }
              ]
        });
        await art.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});
