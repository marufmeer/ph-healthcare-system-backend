import { Server } from "http";
import app from "./app";
import dotenv from "dotenv";



dotenv.config();

 const bootStrap=async()=>{
let server:Server
const PORT = Number(process.env.PORT) 
  try{
   server=app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 
    const shutdown=async(signal:string)=>{
          console.log(`🛑 ${signal} received. Shutting down...`)
       if(server){
        server.close(()=>{
          process.exit(0)
        })
    
       }
       else{
        process.exit(0)
       }
      //  await prisma.$disconnect()
      //  console.log("Database  disconnected.")
    } 

    process.on("SIGTERM",shutdown)
    process.on("SIGINT",shutdown)
    process.on("unhandledRejection",(error)=>{
      console.log("Unhandled rejection",error)
      shutdown("Unhandled rejection")
    })
    process.on("uncaughtException",(error)=>{
         console.error("Uncaught Exception:", error)
      process.exit(1) 
    })
  }
  catch(error){
    console.log('Error during server startup',error)
    process.exit(1)
  }
 }

bootStrap()