import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv' // here this use because use of .env file with out this server goes error
dotenv.config(); // initalized it 
// connect mongodb like this reason to hide password .env files ignored when uploding git hub

mongoose.connect(process.env.MONGO) 
.then(()=>{
    console.log("Connected to the MongoDB!!!")
})
.catch((err)=>{
    console.log(err)
})




const app = express()

app.listen(3000, ()=>{
    console.log("Server is Runnig on port 3000")
})