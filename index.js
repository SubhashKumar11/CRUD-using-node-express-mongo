const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

var User = require('./model/indexmodule')
//way to use bodyparser.body parser is use to get form data
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
//setting view engine
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('insert')
})
//mongodb connection
mongoose.connect('mongodb://localhost:27017/crud_using_node',{
    useUnifiedTopology: true, useNewUrlParser:true
})
var connection = mongoose.connection;
connection.once('open',()=>{
    console.log('db connected')
})
//setting up route for form insertion
app.post('/insert',(req,res)=>{
   //creating object for module
   var user = new User({
    name:req.body.name,  //so that it get the value written by user
    email:req.body.email,
    password:req.body.password
   })
   //to save the user input
   user.save(()=>{
    res.send('data saved.')
   })
})
//route for show data after fetching from database
app.get('/show',(req,res)=>{
    User.find({},(err,result)=>{  //this line fetch all data
        res.render('show',{users:result}) //this users is use in show.ejs
    })
   
})
//delete route .for deleting the data
app.get('/delete/:id',async (req,res)=>{
await User.findByIdAndDelete(req.params.id)
res.redirect('/show')
})
//route for  edit the data
app.get('/edit/:id',async(req,res)=>{
  await  User.findById(req.params.id,(err,result)=>{
        res.render('edit',{users:result})  //{users : result use  to set users data into result}
    })
})
//route for update when user click on update this update route works
app.post('/update/:id',async(req,res)=>{
await User.findByIdAndUpdate(req.params.id,req.body) //req.body user k dwara dala gya data ko khich lega yaha pe
res.redirect('/show')
})
app.listen(4000,()=>{
    console.log('server running at 4000');
})