import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async(req,res)=>{
    const {username,email,password} = req.body;
    const hasedPassword = bcryptjs.hashSync(password,10); //hash the password
    const newUser = User({username,email,password:hasedPassword});
    
    try{
        await newUser.save();
    res.status(201).json('User created successfully!')
    }
    catch(error){
    res.status(500).json(error.message)
    }
    
    
}