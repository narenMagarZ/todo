import React, { useEffect, useReducer, useState }  from 'react'
import '../style/task.css'
import {Plus,Trash} from 'react-feather'
export default function Task(){
    const TASKCONTAINERBACKGROUND = ['#ff0000','#00ff00','#0000ff']
    function random(max){
        return Math.floor(Math.random() * max)
    }
    const initialTask = [{
            'id' : 1,
            'title' : '',
            'time' : '00:00 am - 00:00 am',
            'isDone' : false
    }]
    const taskReducer = (state,{type,payload})=>{
        if(type === 'ADDNEWTASK')
            return [...state,payload]
        else if(type === 'REMOVETASK')
            return payload
        else if(type === 'EDITTASK')
            return [...state]
        else return state
    }
    const [tasks,dispatchTask] = useReducer(taskReducer,initialTask)
    useEffect(()=>{
        function addTask(e){
                dispatchTask({
                    'type' : 'ADDNEWTASK',
                    'payload' : {
                        'id' : 0,
                        'title' : '',
                        'time' : '00:00 am - 00:00 am',
                        'isDone' : false
                     }
                })
             
        }
        function removeTask(e){
            const { id }= e.target.dataset
            tasks.splice(parseInt(id),1)
            dispatchTask({
                'type' : 'REMOVETASK',
                'payload' : [...tasks]
            })
        }
    
        const addTaskBtn = document.querySelectorAll('#add-task-btn')
        const removeTaskBtn = document.querySelectorAll('#remove-task-btn')
        const taskTitleField = document.querySelectorAll('#task-title-field')
        const taskTimeField = document.querySelectorAll('#task-time-field')

        addTaskBtn.forEach((btn)=>{
            btn.addEventListener('click',addTask)
        })
        removeTaskBtn.forEach((btn)=>{
            btn.addEventListener('click',removeTask)
        })
        taskTitleField.forEach((field)=>{
            field.addEventListener('change',setTitle)
        })
        taskTimeField.forEach((btn)=>{

        })
        
        return()=>{
            addTaskBtn.forEach((btn)=>{
                btn.removeEventListener('click',addTask)
            })
            removeTaskBtn.forEach((btn)=>{
                btn.removeEventListener('click',removeTask)
            })
        
        }
    })
    useEffect(()=>{
        console.log(tasks)
    },[tasks])
    function setTitle(e){
        const { id } = e.target.dataset
        tasks[parseInt(id)] = {
            ...tasks[parseInt(id)],
            'title' : e.target.value
        }
        dispatchTask({
            'type' : 'EDITTASK',
            'payload' : tasks
        })
        
    }
    return(
        <div className='task-container'>
            {
                tasks.map(({id,title,time,isDone},index)=>{
                    return (
                        <div className='that-task-container' key={index}>
                            <div draggable className='that-inner-task-container'>
                                <div id='task-detail-tap-container'>
                                <input data-id={index} id='task-title-field' placeholder ="title here..."
                                value={title}
                                onChange = {(e)=>setTitle(e)} 
                                />
                                <div id='task-time-field-container'>
                                <input id='task-time-field' type='time' />
                                <input id='task-time-field' type='time' />
                                </div>
                                </div>
                            </div>
                            <div id='task-control-container'>
                                <button id='add-task-btn'>
                                    <Plus size={15} id='add-task' />
                                </button>
                                <button id='remove-task-btn' data-id={index}>
                                    <Trash size={15} id='remove-task' />
                                </button> 
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}