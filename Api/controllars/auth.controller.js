import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async(req,res,next)=>{
    const {username,email,password} = req.body;
    const hasedPassword = bcryptjs.hashSync(password,10); //hash the password
    const newUser = User({username,email,password:hasedPassword});
    
    try{
        await newUser.save();
    res.status(201).json('User created successfully!')
    }
    catch(error){
    next(error)
    }   
}
//define function to the user sign in 
export const signin = async (req,res,next) =>{
    const {email,password} = req.body;
    try {
        //cheak email is in the data base or not
        const validUser = await User.findOne({email});
        //if not validated email pass the error using middleware
        if(!validUser) return next (errorHandler(404,'User not found!'));
        //then chek pword(hash pword is there so use comprseSync in bcrypt to compare pword )
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(console.error(401,'Input Password Is Wrong!'));
       //create cookies for sign in
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
       //Remove Password from cookie
       const {password:pass, ...rest} = validUser._doc;
       
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest )

    } catch (error) {
        next(error)
    }
}