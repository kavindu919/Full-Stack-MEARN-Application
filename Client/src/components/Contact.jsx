import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({listing}) {

    const [landloard,setLandloard] = useState(null)
    const [message,setMessage] = useState('')

    const onChange = (e) => {
        setMessage(e.target.value)
    }
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandloard(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandlord()
    },[listing.userRef])
  return (
    <>
        {landloard && (
            <div className='flex flex-col gap-2'>
                <p className='font-semibold'>Contact <span className='font-semibold'>{landloard.username}</span>for <span>{listing.name.toLowerCase()}</span></p>
                <textarea name="message" id="message" rows="2" value={message} onChange={onChange} placeholder='Enter Your Message Here!' className='w-full border p-3 rounded-lg'  ></textarea>
                <Link to={`mailto:${landloard.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>Send Message</Link>
            </div> 
        )}
    </>
  )
}
