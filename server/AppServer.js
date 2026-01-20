const express=require('express');
const Router=require('./routes/Router.js')
const cors=require('cors')

const app=express();
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api',Router);
app.listen(3000,(err)=>{
    if(err){
        console.log(err);
        
    }else{
        console.log('Server running at 3000');
        
    }
})