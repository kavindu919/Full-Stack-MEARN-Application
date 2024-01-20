import Listing from "../models/listning.model.js";
import { errorHandler } from "../utils/error.js";

export const  createListing = async(req,res,next) => {
   try {
     const listing = await Listing.create(req.body);
     return res.status(201).json(listing)
   } catch (error) {
    next(error)
   }
}

export const deleteListing = async (req,res,next) => {
  //cheak if listing is exsist or not 
  const listing = await Listing.findById(req.params.id);
  //if listing dosent exsist throw error 
  if(!listing){
    return next(errorHandler(404,'Listing not found!'))
  }
  //if listing is exsist cheak the user is actual owner of this list
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'You can only delete your own listings!'))
  }

  try {
    //delete user
    await Listing.findByIdAndDelete(req.params.id)
    res.status(200).json('Listing has been Deleted!')
  } catch (error) {
    next(error)
  }

}