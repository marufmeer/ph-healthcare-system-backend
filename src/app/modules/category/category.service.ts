import { Request } from "express";
import { prisma } from "../../../shared/prisma";
import { Category } from "@prisma/client";

const inserIntoDB = async (req: Request) => {

    const file = req.file;

    if (file) {
     req.body.icon=file.path
    }

    const result = await prisma.category.create({
        data: req.body
    });

    return result;
};

const getAllFromDB = async (): Promise<Category[]> => {
    return await prisma.category.findMany();
}

const deleteFromDB = async (id: string): Promise<Category> => {
    const result = await prisma.category.update({
        where: {
            categoryId:id,
        },
        data:{
            isActive:false
        }
    });
    return result;
};

export const CategoryService = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB
}