import { z } from "zod";

const create = z.object({

    name: z.string({
        error: "name is required!"
    }),
    categoryId:z.string({
        error:"CategoryId is required!"
    })
});

export const SpecializationValidtaion = {
    create
}