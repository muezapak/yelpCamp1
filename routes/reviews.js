const express = require('express');
const router = express.Router({ mergeParams: true });






const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const db=require('../connection')
const Campground = require('../models/campgrounds');
const Review=require('../models/reviews')
//for layout polishing
const ejsMate=require('ejs-mate')
//for request printing we using morgan middleware
const morgan=require('morgan')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
//it used for efficient validation of data according to pre defined schema
const joi=require('joi')
const { campgroundSchema } = require('../schemas');
const {reviewSchema}=require('../schemas')









const validateReview=(req,res,next)=>{
    const{error}=reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}

router.post('/',validateReview,catchAsync(async(req,res)=>
{
    console.log("hello")
   // res.send("got it")
     const {id}=req.params;
     console.log("id"+id)
     console.log(req.body.review)
   const review=new Review(req.body.review)
   
    
     const campground= await Campground.findById(id)
     campground.reviews.push(review)
     await review.save()
     await campground.save()
     console.log(campground)
     req.flash('success','seuccessfuly created review')
     res.redirect('/campgrounds/'+id)

}))

router.delete('/:reviewId',catchAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    //we are just deleting the review not the campground so campground gets updated
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','seuccessfuly deleted review')
    res.redirect('/campgrounds/'+id);
}))
// 

//passing error handling function to router.use


// router.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!'
//     res.status(statusCode).render('error', { err })
// })

module.exports=router
