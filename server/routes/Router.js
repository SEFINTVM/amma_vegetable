const express=require('express')
const Router=express.Router();
const veg=require('../database/demo.js')
const bcrypt=require('bcryptjs')
const path=require('path')
const session=require('express-session');
const  mongoose  = require('mongoose');
const strict = require('assert/strict');
// require('dotenv').config()



const NewUser=new mongoose.Schema({
      Name:String,
      Phone:Number,
      Email:String,
      Password:String,
      Address:String,
      Place:String,
})

const User=mongoose.model('User',NewUser);


Router.get('/products',(req,res)=>{
   console.log(veg);
   res.json(veg);
   
})

Router.post('/register',async(req,res)=>{
      const RegData=req.body;
      console.log(RegData);

      if(!RegData.Email||!RegData.Password){
             return res.status(400).json({ message: 'Email and Password required' });
      }

      const existUser= await User.findOne({Email:RegData.Email})
      if(existUser) return res.status(400).json({message:'Already User Registered'})
      
      const hashedPassword = await bcrypt.hash(RegData.Password, 10);

      try{
            const user=new User({
                  Name:RegData.Name,
                  Phone:RegData.Phone,
                  Email:RegData.Email,
                  Password:hashedPassword,
                  Address:RegData.Address,
                  Place:RegData.Place
            })

            await user.save();
           

            res.status(200).json({
            message:'User Registration Successful'
      })
      }catch(err){
            console.error(err);
            
      }
      
      req.session.UserID=User._id
})

Router.post('/login',async(req,res)=>{
      const LogData=req.body;
            console.log(LogData);
      try{
            

            if(!LogData.Email||!LogData.Password){
                  return res.status(400).json({message:'Email and Password os missing '})
            }
            const findUser=await User.findOne({Email:LogData.Email})
            if(!findUser) return res.status(400).json({message:'User Not Found'})

            
            const isMatch=await bcrypt.compare(LogData.Password,findUser.Password)
            if(!isMatch) return res.status(400).json({message:'Password is Incorrect'})

            req.session.userID=findUser._id;

            res.json({
                  message:'Login Successful'
            })
      }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Server error' });
            
      }
      
})

Router.post('/logout',(req,res)=>{
      req.session.destroy(err=>{
            if(err){
                  console.error(err);
			return res.status(500).json({message:'Logout Failed'})
            }
      })
      res.json({ message: 'Logged out successfully' });
})

module.exports=Router