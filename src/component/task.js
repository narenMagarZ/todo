import React, { useEffect, useReducer, useRef }  from 'react'
import '../style/task.css'
import {Plus,Trash} from 'react-feather'
import victoryMP3 from '../audiofile/victory.mp3'
export default function Task(){
    const victory = useRef(new Audio(victoryMP3))
    const initialTask = [{
            'title' : '',
            'startTime' : '05:00;05:00',
            'endTime' : '05:00;05:00',
            'isDone' : null,
            'beepTime' : [],
            'isStartTimeValid' : false,
            'isBeeped' : false,
            'isEndTimeValid' : false,
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
        else if(type === 'STARTBEEP')
            return [...state]
        else if(type === 'SETBEEPTIME')
            return [...state]
        else if(type === 'TASKSTATUS')
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
        addTaskBtn.forEach((btn)=>{
            btn.addEventListener('click',addTask)
        })
        removeTaskBtn.forEach((btn)=>{
            btn.addEventListener('click',removeTask)
        })
        taskTitleField.forEach((field)=>{
            field.addEventListener('change',setTitle)
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
    function setTitle({target}){
        const id = parseInt(target.dataset.id)      
        tasks[parseInt(id)] = {
            ...tasks[parseInt(id)],
            'title' : target.value,
        }
        dispatchTask({
            'type' : 'EDITTASK',
            'payload' : tasks
        })
        
    }
    const calculateHour = (hour,minute,second=0)=>hour + (minute / 60) + (second / 3600)

    function setBeepTime(isStartTimeValid,isEndTimeValid,taskEndTime){
        if(isStartTimeValid && isEndTimeValid) return [taskEndTime[0],taskEndTime[1] === 0 ? 1 : taskEndTime[1]]
        else return []
    }
     
    function checkValidTaskTime(startTime,endTime){
        const splitStartTime = [...startTime.split(':')]
        const splitEndTime = [...endTime.split(':')]
        const startHour = parseInt(splitStartTime[0])
        const startMinute = parseInt(splitStartTime[1])
        const endHour = parseInt(splitEndTime[0])
        const endMinute = parseInt(splitEndTime[1])

        let isValidTime = false
        const sTotalHour = calculateHour(startHour,startMinute)
        const eTotalHour = calculateHour(endHour,endMinute)
        const gapHour = eTotalHour - sTotalHour
        if( gapHour < 24 || (startHour >= 13 && endHour <= 23)){
            isValidTime = true
        } 
        return isValidTime
    }

    function convertStrToArray(strArray){
        const intArray = [...strArray.split(':')]
        return [parseInt(intArray[0]),parseInt(intArray[1])]
    }
    function setStartTime({target}){
        const id  = parseInt(target.dataset.id)
        tasks[id] = {
            ...tasks[id],
            'startTime' : `${target.value};${target.value}`,
        }
        const startTimeHolder = convertStrToArray(target.value)
        const date = new Date()
        const activeHour = date.getHours()
        const activeMinute = date.getMinutes()
        const activeTimeToHour = calculateHour(activeHour,activeMinute)
        const startTimeToHour = calculateHour(startTimeHolder[0],startTimeHolder[1])
        if(startTimeToHour < activeTimeToHour ){
            tasks[id].isStartTimeValid = false
            target.parentElement.previousSibling.hidden = false
        } else {
            target.parentElement.previousSibling.hidden = true
            tasks[id].isStartTimeValid = true
        }
        dispatchTask({
            'type' : 'SETSTARTTIME',
            'payload' : tasks
        })

    }

    function setEndTime({target}){
        const id = parseInt(target.dataset.id)
        let endTime = target.value
        const taskEndTime = convertStrToArray(target.value)
        if(taskEndTime[0] === 0){
            taskEndTime[0] = 24
            if(taskEndTime[1] === 0){
                endTime = '24:00;00:00'
            } else {
                endTime = '24:00;00:00'
            }
        } else {
            endTime = `${target.value};${target.value}`
        }
        const date = new Date()
        const activeHour = date.getHours()
        const activeMinute = date.getMinutes()
        const activeTimeToHour = calculateHour(activeHour,activeMinute)
        const endTimeToHour = calculateHour(taskEndTime[0],taskEndTime[1])
        if(endTimeToHour < activeTimeToHour){
            target.parentElement.previousSibling.hidden = false
            tasks[id].isEndTimeValid = false
        } else {
            target.parentElement.previousSibling.hidden = true
            tasks[id].isEndTimeValid = true
        }
        if(checkValidTaskTime(tasks[id].startTime,endTime)){
            tasks[id] = {
                ...tasks[id],
                'endTime' : endTime,
                'beepTime' : setBeepTime(tasks[id].isStartTimeValid,tasks[id].isEndTimeValid,taskEndTime)
            }
                dispatchTask({
                    'type' : 'SETENDTIME',
                    'payload' : tasks

                })
        }
    }
    useEffect(()=>{
        const interval = setInterval(()=>{
            const progressBars = document.querySelectorAll('#progress-bar') 
            let taskIndexer = 0
            for(let progressBar of progressBars){
                if(tasks[taskIndexer].isDone) {
                    progressBar.style = 'width : 100%' 
                    break
                }
                if(!tasks[taskIndexer].isStartTimeValid ||  !tasks[taskIndexer].isEndTimeValid) break
                    const {startTime,endTime} = tasks[taskIndexer]
                    const startTimeHolder = startTime.split(';')[0]
                    const endTimeHolder = endTime.split(';')[0]
                    const initialTime = convertStrToArray(startTimeHolder)
                    const finalTime = convertStrToArray(endTimeHolder)
                    const initialTimeToHour = calculateHour(initialTime[0],initialTime[1])
                    let finalTimeToHour = calculateHour(finalTime[0],finalTime[1])
                    const gapInFinalAndInitialHour = finalTimeToHour - initialTimeToHour
                    const currentActiveTask = [...initialTime,...finalTime,gapInFinalAndInitialHour]
                    const date = new Date()
                    const activeHour = date.getHours()
                    const activeMinute = date.getMinutes()
                    const activeSecond = date.getSeconds() 
                    const beepTime = tasks[taskIndexer].beepTime
                    console.log(beepTime,'beep time')
                    if(activeHour === beepTime[0] && activeMinute === beepTime[1] && !tasks[taskIndexer].isBeeped ){
                            victory.current.play()
                            tasks[taskIndexer].isBeeped = true
                            dispatchTask({
                                'type' : 'STARTBEEP',
                                'payload' : tasks
                            })    
                    }
                    let startHour = currentActiveTask[0]
                    let endHour = currentActiveTask[2]
                    if(startHour === 0 ) startHour = 24
                    if(endHour === 0 ) endHour = 24
                    
                    const activeTimeToHour = calculateHour(activeHour,activeMinute)
                    const startTimeToHour = calculateHour(currentActiveTask[0],currentActiveTask[1])
                    const endTimeToHour = calculateHour(currentActiveTask[2],currentActiveTask[3])
                    const isStartTimeValid = tasks[taskIndexer].isStartTimeValid
                    const isEndTimeValid = tasks[taskIndexer].isEndTimeValid
                    let isOkay = false
                    if((activeTimeToHour >= startTimeToHour && 
                        activeTimeToHour <= endTimeToHour &&
                        isStartTimeValid && isEndTimeValid )) isOkay = true
                    else if(isOkay){
                        const gap = Math.abs(startHour - activeHour)  + 
                        Math.abs(currentActiveTask[1] - activeMinute )  / 60 + (activeSecond / 3600)
                        function calculateGapPercentage(currentGap,totalGap){
                            let gapPercentage = 0
                            if(totalGap !== 0){
                                gapPercentage = ( currentGap * 100 ) / totalGap
                            }
                            return gapPercentage 
                        }   
                        const progressBarWidth = calculateGapPercentage(gap,currentActiveTask[4])
                        if(progressBarWidth < 100){
                            progressBar.style = 'width : ' + progressBarWidth + '%'
                            tasks[taskIndexer] = {
                                ...tasks[taskIndexer],
                                'isDone' : false
                            }
                            dispatchTask({
                                'type' : 'TASKSTATUS',
                                'payload' : tasks
                            })
                        }
                        else if(progressBarWidth >= 100 && !tasks[taskIndexer].isDone ) {
                            progressBar.style = 'width : 100% ' 
                            tasks[taskIndexer] = {
                                ...tasks[taskIndexer],
                                'isDone' : true
                            }
                            dispatchTask({
                                'type' : 'TASKSTATUS',
                                'payload' : tasks
                            })
                            }
    
                    }
                    else if(!tasks[taskIndexer].isDone) {
                        progressBar.style = 'width : 0%'
                    } 
                    taskIndexer ++ 
            } 
        },1000)
        return ()=>{
            clearInterval(interval)
        }
    },[tasks])
    return(
        <div className='task-container'>
            {
                tasks.map(({title,startTime,endTime,isDone},index)=>{
                    return (
                        <div className='that-task-outer-container' key={index} >
                        <div className='that-task-container'>
                            <div draggable className='that-inner-task-container'>
                                <div id='task-detail-tap-container'>
                                <input data-id={index} id='task-title-field' placeholder ="title here..."
                                value={title}
                                onChange = {(e)=>setTitle(e)} 
                                />
                                <div id='task-time-field-container'>
                                    <div id='task-start-time-container'>
                                        <div hidden id='task-start-time-info-container'>
                                            <span>
                                                Cannot set this time
                                            </span>
                                        </div>
                                        <div>
                                            <input data-id = {index} id='task-time-field' value={startTime.split(';')[1]} 
                                            type='time' onInput={(e)=>setStartTime(e)} />
                                        </div>
                                    </div>  
                                    <div id='task-end-time-container'>
                                        <div hidden id='task-end-time-info-container'>
                                            <span>
                                                Cannot set this time
                                            </span>
                                        </div>
                                        <div>
                                <input data-id = {index} id='task-time-field' value={endTime.split(';')[1]}
                                type='time' onInput={(e)=>setEndTime(e)} />
                                        </div>
                                    </div>                          
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
                            <div id='task-status-container'>
                                <div id='task-status-inner-container' style={{'backgroundColor':  isDone ? "#ff0000" : '#000000'  }} >
                                     <span>{isDone === null ?'Not assigned yet!':isDone ? "Completed" : 'On progress'}</span>
                                </div>
                            </div>

                         </div>
                    )
                })
            }
            
        </div>
    )
}