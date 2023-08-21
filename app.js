const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const db=require('./connection')
const Campground = require('./models/campgrounds');
const Review=require('./models/reviews')
//for layout polishing
const ejsMate=require('ejs-mate')
//for request printing we using morgan middleware
const morgan=require('morgan')
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')
//it used for efficient validation of data according to pre defined schema
const joi=require('joi')
const { campgroundSchema } = require('./schemas');
const {reviewSchema}=require('./schemas')
//const router = express.Router();
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const session =require('express-session')
const flash=require('connect-flash')








const app = express();
// to print every incomin request
app.use(morgan('tiny'))

// Mount the routes
     //prefix route    file of route
    // app.use('/campgrounds/:id/reviews', reviews)
//app.use('/campgrounds',campgrounds)



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//app.use is just a way to run a piece of code on every single req
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//tell express we r using ejs mate instead of default ejs
app.engine('ejs',ejsMate)
//static files
app.use(express.static('public'))

const sessionConfig={
    secret:'thisisnotgoodsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
httpOnly:true,
expires:Date.now()+1000*60*60*24*7,
maxAge:Date.now()+1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use((req,res,next)=>{
    //by setting to local we will have access to this in our templates

res.locals.success=req.flash('success')
res.locals.error=req.flash('error')
next()
})


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})