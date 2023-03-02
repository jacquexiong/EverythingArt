if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // npm i dotenv
}
const fetch = require('node-fetch');
// import fetch from "node-fetch";
global.fetch = fetch;

const express = require('express'); // backend
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // for parsing
const session  = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/artpiece'; 
const MongoStore = require('connect-mongo');


const userRoutes = require('./routes/user');
const artpiecesRoutes = require('./routes/artpieces');
const { initialize } = require('passport');

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

// mongodb://localhost:27017/artpiece

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method')); // html can only get and post, so need to fake a put using method override
app.use(express.static(path.join(__dirname, 'public')));

// const store =  MongoStore.create({
//     url: dbUrl,
//     secret: 'this',
//     touchAfter: 24 * 3600 // time period in seconds
// });

// store.on("error", function(e){
//     console.log("Session Store Error", e);
// })

const secret = process.env.SECRET || 'thisissecrete';

const sessionConfig = {
    name: 'session',
    secret,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24, // one day
        maxAge: 1000 * 60 * 60 * 24
    }
}

app.use(session(sessionConfig)); // must be used before passport session
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how to store user in the session
passport.deserializeUser(User.deserializeUser());

const { createApi } = require('unsplash-js');
const unsplash = createApi({
    accessKey: process.env.Unsplash_AccessKey
});


// const getRandomHomePic = async(req, res) => {
//     const result = await unsplash.photos.getRandom({topicIds: [bo8jQKTaE0Y, xHxYTMHLgOc, iUIsnVtjB0Y], count: 1, });
//     console.log(result);
// }

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success'); // global
    res.locals.error = req.flash('error'); // global
    next();
})

// app.use(morgan('tiny'));
// written in artpieces.js file
app.use('/', userRoutes);
app.use('/artpieces', artpiecesRoutes);

app.get('/', async(req, res) => {
    try{
        const result = await unsplash.photos.getRandom({topicIds: ['bo8jQKTaE0Y', 'xHxYTMHLgOc', 'iUIsnVtjB0Y'], count: 1, });
        if (result.status===200) {
            const photo = result.response[0];
            console.log(photo);
            return res.render('home', {photo});
        }
    } catch(e) {
        req.flash('error', e.message);
    }
    const photo = {
        "urls":
            {"full":'https://images.unsplash.com/photo-1670987117206-6b5328d6c126?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzODE2MDF8MHwxfGFsbHwxOXx8fHx8fDJ8fDE2NzEwNjk3MjI&ixlib=rb-4.0.3&q=80'}, 
        "user": 
            {"name": 'Kellen Riggin'}, 
        "created_at": '2022-12-14'
    };
    res.render('home', {photo});
    
})

// order matters, has to be in the end
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'something went wrong'} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
}) 
 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

