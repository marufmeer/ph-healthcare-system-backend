import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helpers/pick";
import { userFilterableFields, userOptionsFields, userSearchableFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";

/* ================= CREATE USERS ================= */

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerUser(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});

const createAssistant = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAssistant(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Assistant created successfully!",
    data: result,
  });
});

/* ================= READ USERS ================= */

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
   const filter=pick(req.query,userFilterableFields)
   const options=pick(req.query,userOptionsFields)
  const result = await UserService.getAllFromDB(filter,options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
  data: result,
  });
});

const getSingleUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  // req.user comes from auth middleware
  const result = await UserService.getMyProfile(req.user as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully!",
    data: result,
  });
});

/* ================= UPDATE ================= */

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  
  const result = await UserService.updateProfile(req);
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile status updated successfully!",
    data: result,
  });
});


/* ================= EXPORT ================= */

export const UserController = {
  registerUser,
  createUser,
  createPatient,
  createAdmin,
  createDoctor,
  createAssistant,
  getAllFromDB,
  getSingleUserFromDB,
  getMyProfile,
  changeProfileStatus,
 updateProfile
};
