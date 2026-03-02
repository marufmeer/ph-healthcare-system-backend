import {addHours,addMinutes,format} from "date-fns"
import { convertDateTime } from "./schedule.utils"
import { prisma } from "../../../shared/prisma"


const scheduleGenerate=async(payload:any)=>{
 const {startDate,endDate,date,startTime,endTime,duration}=payload
 
}
const scheduleUpdate=()=>{

}
const scheduleDelete=()=>{

}

export const scheduleServices={
    scheduleGenerate,
    scheduleUpdate,
    scheduleDelete
}