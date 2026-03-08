import {addHours,addMinutes,format} from "date-fns"
import { convertDateTime } from "./schedule.utils"
import { prisma } from "../../../shared/prisma"
import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"


const scheduleGenerate=async(req:Request)=>{
 const {startDate,endDate,date,startTime,endTime,duration}=req.body
 const decodedToken=req.user as JwtPayload
 const isDoctorExist=await prisma.doctor.findUniqueOrThrow({
    where:{
     userId:decodedToken.id,
     isDeleted:false   
    }
 })
 const scheduleArray=[]
 let currentDate=new Date(startDate)
 const lastDate=new Date(endDate)
 const [startHour,startMinute]=startTime.split(":")
 const [endHour,endMinute]=endTime.split(":")
 while(currentDate<=lastDate){
    let startDateTime=new Date(currentDate)
startDateTime.setHours(startHour,startMinute,0,0)
    const endDateTime=new Date(currentDate)
endDateTime.setHours(endHour,endMinute,0,0)
  const slotDate=new Date(currentDate)
while(startDateTime<endDateTime){
   const slotNext=addMinutes(startDateTime,duration)
    scheduleArray.push({
    docotrId:isDoctorExist.doctorId,
    date:slotDate,
 startDateTime:convertDateTime(startDateTime), 
  endDateTime:convertDateTime(slotNext)
 })
startDateTime=slotNext
}
currentDate.setDate(currentDate.getDate()+1)
 }
 await prisma.schedule.createMany({
    data:scheduleArray
 })
 return scheduleArray
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