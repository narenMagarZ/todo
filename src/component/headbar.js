import React, { useEffect, useRef, useState } from 'react'
import '../style/headbar.css'
export default function HeadBar(){
    const [englishDate,setEnglishDate] = useState(null)
    useEffect(()=>{
        const date = new Date()
        console.log(date)
        setEnglishDate(()=>date.toDateString())
    },[])
    return(
        <div className='headbar-container'>
            <span>
                {englishDate}
            </span>
        </div>
    ) 
}