import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${listing._id}`}>
            <img src= {listing.imageUrls[0]} alt="images"className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'/>
       <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
            <div className='flex items-center gap-1'>
                <MdLocationOn className='h-4 w-4 text-green-700 '/>
                <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
            </div>
            <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
            <p className='text-slate mt-2 font-semibold flex items-center'>
              $  {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                 {listing.type === 'rent' && '/month'}
           </p>
           <div className='text-slate-700 felx gap-4'>
            <div className='font-bold text-xs'>
                {listing.bedroom > 1 ? `${listing.bedroom} beds`: `${listing.bedroom} bed`}
            </div>
            <div className='font-bold text-xs'>
                {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms`: `${listing.bathrooms} bathroom`}
            </div>
           </div>
            <div>
         </div>
         </div>
       
        </Link>

    </div>
  )
}
