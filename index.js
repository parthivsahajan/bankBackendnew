
// import express inside index.js
const express = require('express')

// import cors in index.js
const cors = require('cors')

// import dataService
const dataService = require('./services/dataService')

// import jsonwebtoken 
const jwt =require('jsonwebtoken')

// Create server app using express
const server = express ()

// use cors
server.use(cors({
    origin:'http://localhost:4200'
}))

// To parse Json data
server.use(express.json())

// Set up port for server app
server.listen(3000,()=>{
    console.log('server started at 3000')
})

// application specific middleware 

const appMiddleware=(req,res,next)=>{
    console.log("Inside application specific middleware ")
    next()
}

server.use(appMiddleware)

// token verify midleware

const jwtMiddleware = (req,res,next)=>{
    console.log("Inside router specific middleware")
    // grt token from req headers
    const token = req.headers['access-token']
    
try{  
    // verify token
    const data = jwt.verify(token,'supersecretkey123')

       // fromAcno used for foudTransfer
       console.log(data)
      // req.fromAcno = data.currentAcno
       console.log(data.currentAcno)
        req.fromAcno=data.currentAcno

    console.log("Valid token");
    next()
   }
   catch{
    console.log("Invalid token")
    res.status(401).json({
        message:'Please Login..!'
    })
   }

}

// bank app front end request resolving 

// post http api call ( register api call )

server.post('/register',(req,res)=>{
    console.log('inside register API ');
    console.log(req.body); 
    //asynchronus
    dataService.register(req.body.uname,req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
        
})

// post http api call ( login api call )

server.post('/login',(req,res)=>{
    console.log('inside login API ');
    console.log(req.body); 
    //asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
        
})

// get http api call ( getBalance )

server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('inside getBalance API ');
    console.log(req.params.acno); 
    //asynchronus
    dataService.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
        
})

//  http api call ( deposit )

server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('Inside deposit API ');
    console.log(req.body); 
    //asynchronus
    dataService.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
        
})


// http api call ( fundTransfer )
 

server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer API ');
    console.log(req.body); 
    //asynchronus
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
        console.log(result); 
        res.status(result.statusCode).json(result)

    })
        
})

//  http api call ( getAllTransaction )

server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('Inside getAllTransaction API ');
    dataService.getAllTransaction(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// delete-account api call 

server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log('inside delete-account API ');
    console.log(req.params.acno); 
    //asynchronus
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
        
})
 