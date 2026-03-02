import { Request } from "express";
import { prisma } from "../../../shared/prisma";
import { Specialization } from "@prisma/client";

const inserIntoDB = async (req: Request) => {
    const result = await prisma.specialization.createMany({
        data: req.body
    });

    return result;
};

const getAllFromDB = async (): Promise<Specialization[]> => {
    return await prisma.specialization.findMany();
}

const deleteFromDB = async (id: string): Promise<Specialization> => {
    const result = await prisma.specialization.delete({
        where: {
            specializationId:id,
        },
    });
    return result;
};

export const SpecializationService = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB
}