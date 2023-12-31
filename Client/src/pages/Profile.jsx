import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useState,useEffect } from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'

//firebase rules created us to image uplod
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 * 1024 && 
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser} = useSelector((state)=>state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const [formData,setFormData] = useState({})
  const dispatch = useDispatch() 

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload = (file) =>{
    const storage = getStorage(app);
    //uploding to be uniqe this time stamp use it avoid same fil uploading
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes)* 100;
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      //get uploaded file 
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL)=>{
            setFormData({...formData, avatar:downloadURL})
          })

      }
    )
    }
  
    const handleChange =  (e) => {
      setFormData({...formData,[e.target.id]:e.target.value});
    }
    const handleSubmit = async (e)=>{
      e.preventDefault();
      try {
        dispatch(updateUserStart())
        const res = await	 fetch (`/api/user/update/${currentUser._id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success === false){
          dispatch(updateUserFailure(data.message))
        }
        dispatch(updateUserSuccess(data))
      } catch (error) {
        dispatch(updateUserFailure(error.message))
      }
    }

    const handleDeleteUser = async () => {
      try {
        dispatch(deleteUserStart())
        const res = await fetch (`/api/user/delete/${currentUser._id}`,{
          method: 'DELETE'
          });
          const data = await res.json();
          if(data.success === false){
            dispatch(deleteUserFailure(data.message));
            return;
          }
          dispatch(deleteUserSuccess(data));

      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }
    const handleSignout = async () => {
        try {
          dispatch(signOutUserStart());

          const res = await fetch('/api/auth/signout');
          const data = await res.json();
          if (data.success === false){
            dispatch(deleteUserFailure(data.message));
            return;
          }
          dispatch(signOutUserSuccess(data));
        } catch (error) {
          dispatch(deleteUserFailure(data.message));
        }
    }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
      <img onClick={()=>fileRef.current.click()} src={ formData.avatar ||currentUser.avatar} alt="Profile Pic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>

      <p className='text-sm self-center'>
      {fileUploadError ? (
      <span className='text-red-700'>Error Image Uploading, less than 2mb</span>
       ) : filePerc > 0 && filePerc < 100 ? (
     <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
      ) : filePerc === 100 ? (
     <span className='text-green-700'>Image Uploaded</span>
      ) : (
      ""
      )}
    </p>


      <input type="text" placeholder='User Name' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username } onChange={handleChange}/> 
      <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email}onChange={handleChange}/> 
      <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/> 
      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      <Link className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 text-center' to={"/create-listing "} > Create Listning </Link>
      </form>
    <div className='flex justify-between mt-5'>
      <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
      <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign Out</span>
    </div>
    </div>
  )
}
