import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://as2.ftcdn.net/jpg/01/18/03/35/220_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg"
    },
    
},{timestamps:true});

const User = mongoose.model('User',userSchema);
export default User;
