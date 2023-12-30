import express from "express";
import { test, updateUser,deleteUser } from "../controllars/user.controllar.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.get('/test', test);
//create api routes for update
router.post('/update/:id',verifyToken,updateUser)
//create api for delete 
router.delete('/delete/:id',verifyToken,deleteUser)

export default router;
