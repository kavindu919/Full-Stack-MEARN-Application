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

export const google = async (req,res,next) =>{
    try {
        //first cheak user exsist or not find one method is using help of UserModule
        const user = await User.findOne({email: req.body.email})
        if (user) {
            //if user exsist then save the user for that create token and save the token in cookie
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
            //separate password from saving
            const {password: pass,...rest}= user._doc;
            res
                .cookie('access_token',token, {httpOnly: true})
                .status(200)
                .json(rest)
        }
        else{
                //random genarate password
                const genaratePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                //hash the password
                const hashedPassword = bcryptjs.hashSync(genaratePassword,10);
                const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4), email:req.body.email, password:hashedPassword, avatar:req.body.photo});
                //save new user
                await newUser.save();
                //create token
                const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET);
                const {password: pass, ...rest} = newUser._doc;
                res.cookie('access_token',token, {httpOnly: true}).status(200).json(rest);
                


        }
    } catch (error) {
        next(error);
    }
}