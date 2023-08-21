const express = require('express');
const router = express.Router({ mergeParams: true });





const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const db=require('../connection')
const Campground = require('../models/campgrounds');
//const Review=require('./models/review')
//for layout polishing
const ejsMate=require('ejs-mate')
//for request printing we using morgan middleware
const morgan=require('morgan')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
//it used for efficient validation of data according to pre defined schema
const joi=require('joi')
const { campgroundSchema } = require('../schemas.js');
//const {reviewSchema}=require('./schemas')




// just wrap the async function inside the catch async


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}




router.get('/',catchAsync(async(req,res)=>
{
   // res.send("recieved")
   
 const campgrounds= await Campground.find({})

res.render('campgrounds/index',{campgrounds})

}))
router.get('/new', (req, res) => {

    res.render('campgrounds/new');
    
 
})

// router.post('/campgrounds',validateCampground,catchAsync( async (req, res,next) => {
//     //if(!req.body.campground) throw new ExpressError('invalid data',400)
//     //const camp = new Campground(req.body.campground);
//     const campground = new Campground(req.body.campground);

//         await camp.save();
//         res.redirect('/campgrounds/'+campground._id)
 
// }))

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','seuccessfuly made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.get('/:id',catchAsync( async (req, res,) => {
    const campground= await Campground.findById(req.params.id).populate('reviews')
    if(!campground)
    {
        req.flash('error','cannot find that campground')
        res.redirect('/campgrounds');
    }  
      res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit',catchAsync( async (req, res) => {
    console.log("getting edit page")
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','seuccessfuly updated campground')
    res.redirect('/campgrounds/'+campground._id)
}));

router.delete('/:id',catchAsync( async (req, res) => {
    //res.send("recieve delete")
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','seuccessfuly deleted campground')
    res.redirect('/campgrounds');
}))

// router.all('/',catchAsync( async (req, res) => {
//   //  res.send("recieve all")
//     // const { id } = req.params;
//     // await Campground.findByIdAndDelete(id);
//     // res.redirect('/campgrounds');
// }))



module.exports = router;
