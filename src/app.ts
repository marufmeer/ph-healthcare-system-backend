import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import dotenv from "dotenv";
import httpStatus from "http-status-codes"

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req: Request, res: Response) =>{
  res.status(httpStatus.CREATED).json({
    message:"Server is created successfully."
  })
})
// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({ 
    success:false,
    message: "Route not found",
    error:{
        path:req.originalUrl,
        message:"Your requested path is not found"
    }

  });
});


export default app;
