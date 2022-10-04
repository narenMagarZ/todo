import React from 'react'
import HeadBar from './headbar'
import Task from './task'

export default function Todo(){
    return(
        <div className='todo-container'>
            <HeadBar/>
            <Task/>
        </div>
    )
}