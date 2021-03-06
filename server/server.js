const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Models
const{ User } = require('./models/user');
const{ Brand } = require('./models/brand');
const{ Type } = require('./models/type');
const{ Product } = require('./models/product');


// Middleware
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');


// ==============Products====================

app.get('/api/product/articles_by_id',(req,res)=>{

})

app.post('/api/product/article', auth, admin,(req,res)=>{
    const product = new Product(req.body);

    product.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            article: doc
        })
    })
})


//==============BRANDS====================
app.post('/api/product/brand',auth,admin,(req,res)=>{
    const brand = new Brand(req.body);

    brand.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            brand: doc
        })
    })
})

app.get('/api/product/brands',(req,res)=>{
    Brand.find({},(err,brands)=>{
        if(err) return res.statur(400).send(err);
        res.status(200).send(brands)
    })
})
//==============CAMERA TYPE====================
app.post('/api/product/type',auth,admin,(req,res)=>{
    const type = new Type(req.body);

    type.save((err,doc)=>{
        if(err) return res.json({success:false, err});
        res.status(200).json({
            success: true,
            type: doc
        })
    })
});

app.get("/api/product/types",(req,res)=>{
    Type.find({},(err,types)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(types)
    })
})

//==============USERS====================

app.get('/api/users/auth', auth, (req,res)=>{
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history

    })
})

app.post('/api/users/register',(req,res)=>{
    const user = new User(req.body);

    user.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success:true,
            
        })
    })
});

app.post('/api/users/login',(req,res)=>{
    // find email
    User.findOne({"email":req.body.email},(err,user)=>{
        if(!user) return res.json({loginSuccess:false,message:'Auth failed, email not found'});

        // check password
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({loginSuccess:false,message:'Wrong password'});

            // generate a token
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('w_auth',user.token).status(200).json({
                    loginSuccess: true
                })
            })
        })
    })
})

app.get('/api/user/logout', auth,(req,res)=>{
    User.findByIdAndUpdate(
        { _id:req.user._id},
        {token: ''},
        (err,doc)=>{
            if(err) return res.json({sucess: false, err});
            return res.status(200).send({
                success: true
            })
        }
    )
})

const port= process.env.PORT || 3002;

app.listen(port,()=> {
    console.log(`Server Running at ${port}`)
})