const express = require("express");
const app = express();

const md5 = require("md5")
const mongodb = require('mongodb')


var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";


app.use(express.urlencoded({extended: true}))
app.use(express.json());

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("database conencted")
  var dbo = db.db("mydb2");


  /// users
  app.post("/user", async(req,res)=>{
    try {
      var user = {
        fullname: req.body.fname,
        email: req.body.email,
        lastname: req.body.lastname,
        password: md5(req.body.password)
      }
  
      let users = await dbo.collection("users").insertOne(user)
      res.status(201).json({
        status: "success",
        data:users
      });
      
    } catch (error) {
      console.log(error)
    }
  })


/// User Profile
app.post("/usersProfile", async(req,res)=>{
 try{
  var userProfile ={
    userId: req.body.userId, 
    dob: req.body.dob,
    mob: req.body.mob
  }
  let userProfile1 =await dbo.collection("usersProfile").insertOne(userProfile)
  console.log(userProfile1);
  res.status(201).json({
    status:"success",
    data:userProfile1
  })
 }catch(error){
  console.log.log(error)
 }
})

  //getapi for Avergae age  of users
  app.get("/avgAge", async(req,res)=>{
    try {
      const result= await dbo.collection("usersProfile").find({}).project({"_id":0, "dob": 1}).toArray()
                                                      
      let sum =0;
      let count=0;

      result.forEach((elem)=>{
        count++
        // console.log(elem.dob)
        var getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
        //date formate YYYY/MM/DD
        let age =(getAge(elem.dob))
        sum = sum +age
        // console.log(age)
      })
      const avgAge = parseInt(sum/count)
      console.log("Average age of all users: ",avgAge)

      res.send(result)
    }
    catch (error) {
      res.send(error)
      console.log(error.message)
    }
  })


//Create Get api and delete user from data base if age more than 25yrs
app.get("/getuser", async(req,res)=>{
  try{
    const result = await dbo.collection("usersProfile").find({}).project({"_id":1,"userId":1, "dob":1}).toArray();


      for(let elem of result){
      var getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
      
      let age =(getAge(elem.dob))

      if(age>25){
        try{
          const removeUser = await  dbo.collection("users").findOneAndDelete({_id: mongodb.ObjectId(elem.userId)});
          const removeProfile = await  dbo.collection("usersProfile").findOneAndDelete({_id:mongodb.ObjectId(elem._id) }) 
          console.log(removeUser)
          console.log(removeProfile)
        }catch(error){
          res.send(error)
          console.log(error.message)
        }
      }
  }

    res.send(result)

  }catch(error){
    res.send(error);
    console.log(error.message)
  }
}) 

//////



  
});


app.listen(3000, ()=>{
  console.log(`server is runnig on port 3000`);
})
