import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import "../src/config/passport"
import dotenv from "dotenv";
import httpStatus from "http-status-codes"
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import passport from "passport";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true })
);
app.set("query parser", "extended");
app.use(passport.initialize())
app.use("/api/v1",router)
app.get("/",(req: Request, res: Response) =>{
  res.status(httpStatus.CREATED).json({
    message:"Server is created successfully."
  })
})
app.use(globalErrorHandler)
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
