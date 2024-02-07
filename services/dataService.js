// impoer db.js
const db = require('./db')

// import jsonwebtoken 
const jwt =require('jsonwebtoken')

  // register
//====================
const register = (uname,acno,pswd)=>{
    console.log('Inside Register function in data service')
    // check acno in mongoDB - db.users.findOne() so import mongodb 
   return db.User.findOne({
    acno
   }).then((result)=>{
       console.log(result)
       if(result){
          return {
            //acno already exist 
            statusCode:403,
            message:'Account alredy exist!!'
           }
       }
       else{
        // to add new user 
        const newUser =new db.User({
            username: uname,
            acno,
            password: pswd,
            balance: 0,
            transactions: []
        })
         // to save new user in mongodb use save()
         newUser.save()
         return{
            statusCode:200,
            message:'Registration successfull..'
         }
            
       }
   })
}

  //login
//=====================
 const login = (acno,pswd)=>{
 console.log('Inside login function body')
 //check acno and pswd in mongodb
 return db.User.findOne({
    acno,
    password:pswd
 }).then(
    (result)=>{
        if(result){
      //generete token
      const token = jwt.sign({
         currentAcno:acno
      },'supersecretkey123')

           return {
              statusCode:200,
              message:'Login successfull',
              username:result.username,
              currentAcno:acno,
              token
            }
        }
        else{
           return {
               statusCode:404,
               message:'Invalid Account / Password'
            }
        }
    }
 )

}

// getBalance 

const getBalance= (acno)=>{
  //check acno and pswd in mongodb
  return db.User.findOne({
     acno
  }).then(
     (result)=>{
         if(result){
            return {
               statusCode:200,
               balance:result.balance
             }
         }
         else{
            return {
                statusCode:404,
                message:'Invalid Account'
             }
         }
     }
  )
 
 }

 // deposit
 const deposit =(acno,amt)=>{
   //string change into number
   let amount=Number(amt)
   return db.User.findOne({
      acno
   }).then((result)=>{
      if(result){
         //acno is present db
         result.balance+=amount
         result.transactions.push({
            type:"CREDITE",
            fromAcno:acno,
            toAcno:acno,
            amount
         })
         //to update in mongodb
         result.save()

         return {
            statusCode:200,
            message:`${amount} Successfully Deposited....`
         }
      }
      else{
         return {
            statusCode:404,
            message:'Invalid Account'
         }
      }
   })
 }

 //fundTransfer

 const fundTransfer = (req,toAcno,pswd,amt) => {
   let amount = Number(amt);
   let fromAcno = Number(req.fromAcno)
   console.log(typeof(fromAcno));
   console.log(typeof(pswd));
   console.log(fromAcno);
   console.log(amount);
   console.log(pswd);
   return db.User.findOne({
      acno:fromAcno,
      password:pswd
   }).then((result)=>{
      if(fromAcno==toAcno){
         return{
            statusCode:401,
            message:"Permission denied due to Own Account Transfer!!"
         }
      }
      //console.log(result);
      if(result){
        //Debit account detaila
        let fromAcnoBalance=result.balance
        if(fromAcnoBalance>=amount){
         result.balance=fromAcnoBalance-amount
         //Credit Account details
         return db.User.findOne({
            acno:toAcno
         }).then((creditdata)=>{
            if(creditdata){
               creditdata.balance+=amount
               creditdata.transactions.push({
                  type:"CREDITE",
                  fromAcno,
                  toAcno,
                  amount
               })

         //to update in mongodb
               creditdata.save();

               result.transactions.push({
                  type:"DEBIT",
                  fromAcno,
                  toAcno,
                  amount
               })
         //to update in mongodb
               result.save();

               return{
                  statusCode:200,
                  message:"Amount Transfer successfully"
               }
            }
            else{
               return{
                  statusCode:401,
                  message:"Invalid Credit Acount Number"
               }
            }
         })
        }
        else{
         return{
            statusCode:401,
            message:"Insufficient Balance"
         }
        }
      }
      else{
         return{
            statusCode:403,
            message:"Invalid Debit Account or Password"
         }
      }

   })
 }
 
 // getAllTransaction
 const getAllTransaction= (req)=>{
   let acno = req.fromAcno
   return db.User.findOne({
      acno
   }).then((result)=>{
      if(result){
         return{
            statusCode:200,
            transaction:result.transactions
         }
      }
      else{
         return{
            statusCode:401,
            message:"Invalid Account Number"
         }
      }
   })
 }
 //delete my account
   const deleteMyAccount=(acno)=>{
      return db.User.deleteOne({
         acno
      })
      .then(
         (result)=>{
            if(result){
              return{
               statusCode:200,
               message:"Account deletion successfully"
              }
            }
            else{
               return{
                  statusCode:401,
                  message:"Invalid Account"
               }
            }
         }
      )
   }

  // export
//=====================
module.exports={
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getAllTransaction,
    deleteMyAccount
}