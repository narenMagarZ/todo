import React, { useEffect, useReducer, useRef, useState }  from 'react'
import '../style/task.css'
import {Plus,Trash} from 'react-feather'
export default function Task(){
    const TASKCONTAINERBACKGROUND = ['#ff0000','#00ff00','#0000ff']
    const [activeHour,setActiveHour] = useState([])
    function random(max){
        return Math.floor(Math.random() * max)
    }
    const initialTask = [{
            'title' : '',
            'startTime' : '05:00',
            'endTime' : '00:00',
            'isDone' : false,
            'gap' : 0
    }]
    const taskReducer = (state,{type,payload})=>{
        if(type === 'ADDNEWTASK')
            return [...state,payload]
        else if(type === 'REMOVETASK')
            return payload
        else if(type === 'EDITTASK')
            return [...state]
        else if(type === 'SETSTARTTIME')
            return [...state]
        else if(type === 'SETENDTIME')
            return [...state]
        else return state
    }
    const [tasks,dispatchTask] = useReducer(taskReducer,initialTask)
    useEffect(()=>{
        function addTask(e){
                dispatchTask({
                    'type' : 'ADDNEWTASK',
                    'payload' : initialTask[0]
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
        setActiveHour(()=>{
            return [...tasks[0].startTime.split(':'),...tasks[0].endTime.split(':')]
        })
        console.log(tasks)
    },[tasks])

    useEffect(()=>{
        console.log(activeHour)
    },[activeHour])
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
    function setStartTime(e){
        let { id } = e.target.dataset
        id = parseInt(id)
        console.log(typeof e.target.value)

        tasks[id] = {
            ...tasks[id],
            'startTime' : e.target.value,
        }
        dispatchTask({
            'type' : 'SETSTARTTIME',
            'payload' : tasks
        })

    }
    function setEndTime(e){
        let { id } = e.target.dataset
        id = parseInt(id)
        const initialTime = tasks[id].startTime.split(':')
        const endTime = e.target.value.split(':')
        console.log(endTime,'case# endtime check')
        const initialTimeToHour = parseInt(initialTime[0]) + ( parseInt(initialTime[1]) / 60 )
        let endTimeToHour = parseInt(endTime[0]) + ( parseInt(endTime[1]) / 60 )
        if(endTimeToHour < initialTimeToHour)
            endTimeToHour = endTimeToHour + 24
        const gap = endTimeToHour - initialTimeToHour
        console.log(gap,'case# gap')
        tasks[id] = {
            ...tasks[id],
            'endTime' : e.target.value,
            'gap' : gap
        }
        dispatchTask({
            'type' : 'SETENDTIME',
            'payload' : tasks
        })
    }
    useEffect(()=>{
        const interval =  setInterval(()=>{
            // const date = new Date(Date.now())
            // function calculateGapPercentage(currentGap,totalGap){
            //     const gapPercentage = ( currentGap * 100 ) / totalGap
            //     return gapPercentage 
            // }         
            // console.log(activeHour)
            // let midNightHour = parseInt(activeHour[2])
            // if(activeHour[2] === '00')
            //     midNightHour = 24
            // console.log(midNightHour,'case# midnight hour')
            // if(parseInt(activeHour[0]) <= date.getHours() && date.getHours() <= midNightHour  ){
            //     console.log('calculating the  gap width')
            //     const gap = Math.abs(( parseInt(activeHour[0]) - date.getHours() )) + Math.abs(( parseInt(activeHour[1]) - date.getMinutes() )) / 60 + (date.getSeconds() / 3600 )  
            //     console.log(gap,'this is gap')
            //     progressBarWidth.current = calculateGapPercentage(gap,tasks[0].gap)
            //     console.log(progressBarWidth.current,'case# progress bar width')
            // }
               
            const progressBars = document.querySelectorAll('#progress-bar') 
            let taskIndexer = 0
            for(let progressBar of progressBars){
                // console.log(progressBar)
                // console.log(tasks[taskIndexer])
                console.log(tasks,'case# tasks')
                const currentActiveTask = [...tasks[taskIndexer].startTime.split(':'),...tasks[taskIndexer].endTime.split(':'),tasks[taskIndexer].gap]
                console.log(currentActiveTask,'case# current active task')
                const date = new Date()
                const activeHour = date.getHours()
                const activeMinute = date.getMinutes()
                const activeSecond = date.getSeconds() 
                console.log(activeHour,'case# active hour ')
                let exceptionStartHour = parseInt(currentActiveTask[0])
                let exceptionEndHour = parseInt(currentActiveTask[2])
                if(exceptionStartHour === 0 )
                    exceptionStartHour = 24
                if(exceptionEndHour === 0 )
                    exceptionEndHour = 24
                if(exceptionStartHour <= activeHour && activeHour <= exceptionEndHour ){
                    const gap = Math.abs(exceptionStartHour - activeHour)  + Math.abs(parseInt(currentActiveTask[1]) - activeMinute )  / 60 + (activeSecond / 3600)
                    console.log(gap)
                    function calculateGapPercentage(currentGap,totalGap){
                        console.log(currentGap,totalGap,'case# calculate gap percentage')
                        const gapPercentage = ( currentGap * 100 ) / totalGap
                        return gapPercentage 
                    }   
                    const progressBarWidth = calculateGapPercentage(gap,currentActiveTask[4])
                    console.log(progressBarWidth,'case# progressBarWidth')
                    progressBar.style = 'width : ' + progressBarWidth + '%'

                } else {
                    progressBar.style = 'width : 0%'
                }

                taskIndexer ++ 
            } 
        },1000)
        return ()=>{
            console.log('i am out')
            clearInterval(interval)
        }
    },[tasks,activeHour])
    return(
        <div className='task-container'>
            {
                tasks.map(({title,startTime,endTime,isDone},index)=>{
                    return (
                        <div className='that-task-container' key={index}>
                            <div draggable className='that-inner-task-container'>
                                <div id='task-detail-tap-container'>
                                <input data-id={index} id='task-title-field' placeholder ="title here..."
                                value={title}
                                onChange = {(e)=>setTitle(e)} 
                                />
                                <div id='task-time-field-container'>
                                <input data-id = {index} id='task-time-field' value={startTime} 
                                type='time' onInput={(e)=>setStartTime(e)} />
                                <input data-id = {index} id='task-time-field' value={endTime}
                                type='time' onInput={(e)=>setEndTime(e)} />
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
                            <div id='progress-bar' className='complete-bar'></div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}