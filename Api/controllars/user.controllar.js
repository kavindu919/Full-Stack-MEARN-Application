import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs'

export const test = async(req, res) => {
    const {username,email,password} = req.body;
    const newUser = new User({username,email,password});
    await newUser.save();
    res.status(201).json("User created succesfully");
};

export const updateUser = async (req,res,next) => {
    //authorization of the user based on token and cookiee
    if(req.user.id !== req.params.id) return next (errorHandler(401,"You can only update only own account!!"))
    //update user
    try {
        //if user try to hash the password => then it hased 
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new:true}//to get new information (updated onece)
        )
        //separate password from other datas
        const {password, ...rest} = updateUser._doc
        res.status(200).json(rest);

    } catch (error) {
        console.log(error)
    }
};