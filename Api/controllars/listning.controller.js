import Listing from "../models/listning.model.js";
import { errorHandler } from "../utils/error.js";

export const  createListing = async (req,res,next) => {
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

export const updateListing = async (req,res,next) => {
  //cheak if listing exsist or not
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    return next(errorHandler(404,'Listing not found'))
  }
  //if listing is exsist cheak the user is actual owner of this list
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'You can only update your own listings '))
  }
  //update listings
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
  }
}
//create function for getListing api 
export const getListing = async (req,res,next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    //cheak listing exsists
    if (!listing) {
      return next(errorHandler(404,'Listing not found'))
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error)
  }
}


//create listing for search function api
export const getListings = async (req,res,next) => {
  try {
    //add searching limits
     const limit = parseInt(req.query.limit) || 9;
     //create start index.
     const startIndex = parseInt(req.query.startIndex) || 0;
     //create search qurey for offer
     let offer = req.query.offer
     //cheak offer status 
     if(offer === undefined || offer === 'false'){
      //cheak inside of the data base offer is availble or not
          offer = { $in: [false,true]}      
     }

      //create qureys for the searching 

       //do same thing above for furnished
       let furnished = req.query.furnished
       if (furnished === undefined || furnished === 'false') {
         furnished = {$in: [false,true]}
       }

       //do same thing for parking
       let parking = req.query.parking
       if(parking === undefined || parking === 'false'){
        parking = {$in: [false,true]}
       }
       
       //do same thing for type
       let type = req.query.type
       if(type === undefined || type === 'all'){
        type = {$in: ['sale','rent']}
       }

       //create search term
       const searchTerm = req.query.searchTerm || '';
       //create sort
       const sort = req.query.sort || 'createdAt';
       //create order method 
       const order = req.query.order || 'desc';

       const listings = await Listing.find({
         name: {$regex:searchTerm,$options: 'i'},
         offer,
         furnished,
         parking,
         type,

       }).sort({[sort]: order}).limit(limit).skip(startIndex)

       //return to the user 
       return res.status(200).json(listings)
    
  } catch (error) {
    next(error)
  }
}