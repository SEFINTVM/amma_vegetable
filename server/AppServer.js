const express=require('express');
const Router=require('./routes/Router.js')
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcryptjs');
const path=require('path')
const session=require('express-session');
const { error } = require('console');
require('dotenv').config();

const app=express();
app.use(cors(
    {origin: 'http://localhost:5173',   // frontend URL
    credentials: true }
));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.use(session({
    secret:'AmmaVegetable',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        maxAge:1000*60*60,
        secure:false,
        sameSite:'lax'
    }
}))


mongoose.connect("mongodb+srv://AmmaUser:AmmaUser123@sefindb.bwyiszt.mongodb.net/AmmaVegetable?appName=SefinDB").then(()=>{console.log("Mongo Connected")}).catch(err=>console.error(err))

app.use('/api',Router);
app.listen(3000,(err)=>{
    if(err){
        console.log(err);
        
    }else{
        console.log('Server running at 3000');
        
    }
})