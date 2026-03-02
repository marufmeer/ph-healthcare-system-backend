import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { SpecializationService} from "./specialization.service"; 
import { catchAsync } from "../../../shared/catchAsync"; 
import sendResponse from "../../../shared/sendResponse"; 

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecializationService.inserIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialization created successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecializationService.getAllFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specializations data fetched successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecializationService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialization deleted successfully',
        data: result,
    });
});

export const SpecializationController = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB
};