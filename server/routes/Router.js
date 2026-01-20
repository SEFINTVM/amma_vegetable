const express=require('express')
const Router=express.Router();
const veg=require('../database/demo.js')


Router.get('/products',(req,res)=>{
   console.log(veg);
   res.json(veg);
   
})

module.exports=Router