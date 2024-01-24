import express from "express";
import { test, updateUser,deleteUser,getUserListings,getUser } from "../controllars/user.controllar.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.get('/test', test);
//create api routes for update
router.post('/update/:id',verifyToken,updateUser)
//create api for delete 
router.delete('/delete/:id',verifyToken,deleteUser)
//create api to listing ids
router.get('/listings/:id',verifyToken,getUserListings)
//create api route for contact lanloard button and function
router.get('/:id',verifyToken,getUser)
export default router;
