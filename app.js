const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const db=require('./connection')
const Campground = require('./models/campgrounds');
//for layout polishing
const ejsMate=require('ejs-mate')
//for request printing we using morgan middleware
const morgan=require('morgan')



const app = express();
// to print every incomin request
app.use(morgan('tiny'))




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//app.use is just a way to run a piece of code on every single req
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//tell express we r using ejs mate instead of default ejs
app.engine('ejs',ejsMate)


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/campgrounds',async(req,res)=>
{
   // res.send("recieved")
   
 const campgrounds= await Campground.find({})

res.render('campgrounds/index',{campgrounds})

})
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect('/campgrounds/'+camp._id)
})

app.get('/campgrounds/:id', async (req, res,) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { camp });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect('/campgrounds/'+camp._id)
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})