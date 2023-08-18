const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const db=require('./connection')
const methodOverride=require('method-override')
const campgrounds = require('./models/campgrounds')


//getting schema
const Campground=require('./models/campgrounds')





app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.listen('3000',()=>{
    console.log("listening on port no 3000")
})



app.get('/campgrounds',async(req,res)=>
{
   
 const campgrounds= await Campground.find({})

res.render('campgrounds/index',{campgrounds})

})
app.post('/campgrounds',async(req,res)=>
{
   
 //const campgrounds= await Campground.find({})
 console.log(req.body)
//res.send("recieved")
const camp=new Campground(req.body.campground)
await camp.save()

res.redirect('/campgrounds/'+camp.id)

//res.render('campgrounds/index',{campgrounds})

})
app.get('/campgrounds/new',async (req,res)=>{

    
    res.render('campgrounds/new',)
   
})


app.get('/campgrounds/:id',async (req,res)=>{

 const camp= await Campground.findById(req.params.id)
 //console.log(camp)
 res.render('campgrounds/show',{camp})

})
app.get('/campgrounds/:id/edit',async (req,res)=>{

    const camp= await Campground.findById(req.params.id)
   // console.log(camp)
    res.render('campgrounds/edit',{camp})
   
   })

   app.put('/campgrounds/:id',async (req,res)=>{

    const {id}=req.params.id
    const camp= await Campground.findOneAndUpdate(id,{...req.body.campground})
    //res.send("worked")

    // console.log(camp)
    res.redirect('/campgrounds/'+camp._id)
   
   })

   app.delete('/campgrounds/:id',async (req,res)=>{

    const {id}=req.params
    console.log("first"+id)
    const camp= await Campground.findById(req.params.id)
    console.log("second"+req.params.id)
    console.log("found")
    const data=await Campground.findOneAndDelete(id)
        console.log(data)    

    //res.send("worked")

    // console.log(camp)
    res.redirect('/campgrounds')
   
   })


app.get('*',(req,res)=>{
   // res.render('home');
   res.send ("request not matched")
  //  res.send("request recieved")
})