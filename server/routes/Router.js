const express=require('express')
const Router=express.Router();
const veg=require('../database/demo.js')
const bcrypt=require('bcryptjs')
const path=require('path')
const session=require('express-session');
const  mongoose  = require('mongoose');
const strict = require('assert/strict');
const jwt=require('jsonwebtoken');
const { error } = require('console');
const { type } = require('os');
const nodemailer=require('nodemailer')
 require('dotenv').config()


const transporter=nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
      },
})

const NewUser=new mongoose.Schema({
      Name:String,
      Phone:Number,
      Email:String,
      Password:String,
      Address:String,
      Place:String,
})

const CartUser=new mongoose.Schema({
      userId:String,
      items:[
            {
                  productName:String,
                  image:String,
                  price:Number,
                  quantity:Number
            }
      ]
})

const OrderScheme=new mongoose.Schema({
      userId:String,
      items:[
            {
                  prodName:String,
                  prodQuantity:Number,
                  prodPrice:Number
            },
      ],
      totalAmount:Number,
      paymentMethod:String,
      Address:String,
      status:{type:String,default:'Confirmed'},
      orderData:{type:Date,default:Date.now()},
})

const User=mongoose.model('User',NewUser);
const Product=mongoose.model('Product',CartUser)
const Order=mongoose.model('Order',OrderScheme)



const AuthMiddleware=(req,res,next)=>{
      const token=req.cookies.token;

      if(!token) return res.status(401).json({ msg: "Not logged in" });

      try{
            const decode=jwt.verify(token,process.env.SECURE_KEY)
            req.user=decode;
            next()
      }catch{
             res.status(401).json({ msg: "Invalid token" });
      }


}

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



            const token=jwt.sign({id:findUser._id},process.env.SECURE_KEY,{expiresIn:'7d'})

            res.cookie('token',token,{
                  httpOnly:true,
                  secure:false,
                  sameSite:'lax'
            })

            res.json({
                  message:'Login Successful'
            })
      }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Server error' });
            
      }
      
})

Router.get('/me',AuthMiddleware,(req,res)=>{
      res.json({userId:req.user.id})
})

Router.get('/Profile',AuthMiddleware,async(req,res)=>{
      try{
            const userId=req.user.id;
            if(!userId){
                  return res.status(401).json({message:'Unauthorized Access'})
            }

            const userProfile=await User.findById(userId).select('-Password');
            console.log(userProfile);
            if(!userProfile){
                  return res.status(404).json({message:'User Not Found'})
            }

            res.json(userProfile);
            
      }catch(err){
            console.error(err);
            res.status(500).json({message:'Server Error'})
      }
})

Router.post('/update',AuthMiddleware,async(req,res)=>{
      try{
            const userId=req.user.id;
            if(!userId){
                  return res.status(401).json({message:'Unauthorized Access'})
            }
            const updateData=req.body;
            console.log(updateData);
            const findUser=await User.findById(userId);
            if(!findUser){
                  return res.status(404).json({message:'User Not Found'})
            }

            await User.updateOne({_id:userId},{$set:{
                  Name:updateData.Name,
                  Phone:updateData.Phone,
                  Email:updateData.Email,
                  Address:updateData.Address,
                  Place:updateData.Place
            }})

            const updatedUser=await User.findById(userId).select('-Password');
            res.json({
                  message:'Profile Updated Successfully',
                  user:updatedUser
            });
      }catch(err){
            console.error(err);
            res.status(500).json({message:'Server Error'})
      }
});

Router.post('/cart/add', AuthMiddleware, async (req, res) => {
  const { ProdName, ProdImage, ProdPrice, ProdQuantity } = req.body;
  const userId = req.user.id;

  try {
    // Find cart for this user
    let cart = await Product.findOne({ userId });

    if (!cart) {
      cart = new Product({ userId, items: [] }); // Fixed model name & userId
    }

    // Check if product already exists
    const itemIndex = cart.items.findIndex(i => i.productName === ProdName);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += ProdQuantity;
    } else {
      cart.items.push({
        productName: ProdName,
        image: ProdImage,
        price: ProdPrice,
        quantity: ProdQuantity
      });
    }

    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

Router.get('/cart',AuthMiddleware,async(req,res)=>{
      const userId=req.user.id;
      console.log(userId);

      try{
            const cart= await Product.findOne({userId});
            res.json(cart)
      }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Server error' });
            
      }


      
})


Router.post('/cart/update-qty', AuthMiddleware, async (req, res) => {
  const { productID, action } = req.body; 
  const userId = req.user.id;

  try {
    const cart = await Product.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i._id.toString() === productID);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "inc") {
      item.quantity += 1;
    } else if (action === "dec") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        
        cart.items = cart.items.filter(i => i._id.toString() !== productID);
      }
    }

    await cart.save();
    res.json({ cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


Router.post('/PassChange',AuthMiddleware,async(req,res)=>{
      const {currentPassword,newPassword}=req.body;
      const userId=req.user.id;

      try{
            if(!currentPassword || !newPassword){
                  return res.status(400).json({ message: "All fields are required" });
            }

            const findUser=await User.findById(userId)
            if (!findUser) return res.status(404).json({ message: "User not found" });

            const isMatch=await bcrypt.compare(currentPassword,findUser.Password);
            if (!isMatch) {
                  return res.status(400).json({ message: "Current password is incorrect" });
            }

            const hasedPassword=await bcrypt.hash(newPassword,10);

            findUser.Password=hasedPassword;
            await findUser.save()

            res.json({ message: "Password changed successfully" });
      }catch(err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
       }
})

Router.post('/cart/remove',AuthMiddleware,async(req,res)=>{
      const {productID}=req.body;
      const userId=req.user.id;
      console.log(productID,userId);
      

      try{
                  const cart= await Product.findOne({userId})
                  if(!cart){
                        return res.status(404).json({ message: "Cart not found" });
                  }

                  cart.items=cart.items.filter(i=>i._id.toString()!==productID)
                  await cart.save()
                  console.log(cart);
                  
                   res.json({ message: "Item removed", cart });
      }catch(err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
      }
})

Router.post('/order',AuthMiddleware,async(req,res)=>{
      try{
           const  userId=req.user.id;
            const { items, total, paymentMethod, address}=req.body;

            if(!items.length || !total || !paymentMethod){
                  return res.status(400).json({message:'Invalid Order'})

            }

            const user=await User.findById(userId)


            let billText=`Hello ${user.Name} \n\n Your Order Is CONFIRMED\n\n`

            items.forEach(element => {
                  billText+=  `${element.productName} - ${element.quantity}  => ${element.price*element.quantity}\n`

                  
            });
            billText += `\nTotal: ₹${total}\nPayment: ${paymentMethod}\n\nThank you for shopping with Amma Vegetable 🥬`;

            await transporter.sendMail({
                  from: process.env.EMAIL_USER,
                  to: user.Email,
                  subject: "Order Confirmed 🛒",
                  text: billText,
            })

             let ownerText = `New Order Received!\n\nCustomer: ${user.Name}\nEmail: ${user.Email}\nAddress: ${user.Address}\nPayment: ${paymentMethod}\n\nProducts:\n`;

                  items.forEach(item => {
                        ownerText += `${item.productName} - ${item.quantity}kg\n`;
                  });

                  ownerText += `\nTotal Amount: ₹${total}`;

            await transporter.sendMail({
                  from: process.env.EMAIL_USER,
                  to: "skdude602@gmail.com",
                  subject: "New Order Alert 🚨",
                  text: ownerText,
            });

            await Product.findOneAndUpdate({ userId }, { items: [] });

             res.json({ message: "Order placed successfully" });


      }catch(err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
      }
})




Router.post('/logout',(req,res)=>{
      res.clearCookie('token')
      res.json({ message: 'Logged out successfully' });
})

module.exports=Router