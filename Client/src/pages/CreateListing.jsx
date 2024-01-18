import React, { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'

export default function CreateListing() {
  const [files, setFiles] = useState([])
  const [formData,setformData] = useState({
    imageUrls: [], 
  })
  const [imageUploadError, setimageUploadError] = useState(false);
  //for loading effect 
  const [uploading,setUploding] =useState(false);
  const handleImageSubmit = (e) =>{
    if(files.length > 0 && files.length +formData.imageUrls.length < 7){
      setUploding(true);
      setimageUploadError(false);
      const promises = [];
      for(let i = 0; i < files.length; i++){
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        //keep privious information
        setformData({...formData,imageUrls: formData.imageUrls.concat(urls)})
        setimageUploadError(false)
        setUploding(false);
        
      }).catch((error) => {
        setimageUploadError('Image Uploading falied (2mb max per image)')
        setUploding(false)
      })

      }else{
        setimageUploadError('You can only upload 6 images per loading')
        setUploding(false);
      }
  }
  console.log(formData)
//create image uploading function
const storeImage = async (file) =>{
  return new Promise((resolve,reject) => {
    const storage = getStorage(app);
    //add date for make file name unique
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage,filename);
    const uploadTask = uploadBytesResumable(storageRef,file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Uploading is ${progress}% done` )
      },
      (error)=> {
        reject(error); 

      },
      //if there is no error get url
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
          resolve(getDownloadURL);
        })
      }
    )
  })
}
//image delete function
  const handleRemoveImage = (index) => {
    setformData({
      //for avoid dupicate images adding
      ...formData,
      imageUrls: formData.imageUrls.filter((_,i)=> i !== index),
    });
  }


  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listning</h1>
    <form className='flex flex-col sm:flex-row gap-4'>
      <div className='flex flex-col gap-4 flex-1'>
      <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required />
      <textarea type="text" placeholder='Discription' className='border p-3 rounded-lg' id='discription' required />
      <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required />
      <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
            <input type="checkbox" id='sale' className='w-5'/>
            <span>Sell</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='rent' className='w-5'/>
            <span>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='parking' className='w-5'/>
            <span>Parking spot</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='furnished' className='w-5'/>
            <span>Furnished</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='offer' className='w-5'/>
            <span>Offer</span>
          </div>
      </div>

      <div className='flex flex-wrap gap-6'>
        <div className='flex items-center gap-2 '>
          <input type="number" id="bedrooms" min='1' max= '10' required className='p-3 border-gray-300 rounded-lg'/>
          <p>Beds</p>
        </div>
        <div className='flex items-center gap-2 '>
          <input type="number" id="bathroom" min='1' max= '10' required className='p-3 border-gray-300 rounded-lg'/>
          <p>Bathrooms</p>
        </div>
        <div className='flex items-center gap-2 '>
          <input type="number" id="regularPrice" min='1' max= '10' required className='p-3 border-gray-300 rounded-lg'/>
          <div className = 'flex flex-col item-center'>
            <p>Regular Price</p>
            <span className='text-xs'>($ / month) </span>
          </div>
          </div>
        <div className='flex items-center gap-2 '>
          <input type="number" id="discountPrice" min='1' max= '10' required className='p-3 border-gray-300 rounded-lg'/>
          <div className = 'flex flex-col item-center'>
            <p>Discounted Price</p>
          <span className='text-xs'>($ / month) </span>
          </div>
        </div>
      </div>
      </div>

    <div className='flex flex-col flex-1 gap-4'>
    <p className='font-semibold'>Images:<span className='font-normal text-gray-600 ml-2'>The first image wil be the cover (max 6)</span></p>
    <div className='flex gap-4'>
      <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id="images" accept='image/*' multiple />
      <button disabled ={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700  border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>
    </div>
    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
    {
      formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
          <div key={url} className='flex justify-between p-3 border items-center'>
            <img src= {url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
            <button type='button' onClick={() =>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
          </div>
      ))
    }
       <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listning</button>
    </div>
    </form>
    
    </main>
  )
}
