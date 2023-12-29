import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv' // here this use because use of .env file with out this server goes error
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

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
app.use(express.json())
// to get infromation from created cookie
app.use(cookieParser())
app.listen(3000, ()=>{
    console.log("Server is Runnig on port 3000")
})
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
//difine a middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})