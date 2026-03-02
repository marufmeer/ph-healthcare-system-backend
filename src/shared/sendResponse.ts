import { Response } from "express";

interface IMeta{
page: number,
limit: number,
total: number
}
interface Idata<T>{
success:boolean;
message:string;
statusCode:number;
data:T|null|undefined
meta?:IMeta
}

 const sendResponse=<T>(res:Response,data:Idata<T>)=>{
 res.status(data.statusCode).json({
    success:data.success,
    message:data.message,
    data:data.data,
    meta:data.meta
 })
}
export default sendResponse