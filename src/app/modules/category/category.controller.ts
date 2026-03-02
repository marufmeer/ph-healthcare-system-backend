import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { CategoryService } from "./category.service";
import { catchAsync } from "../../../shared/catchAsync"; 
import sendResponse from "../../../shared/sendResponse"; 

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.inserIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category created successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category data fetched successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CategoryService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    });
});

export const CategoryController = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB
};