import z from "zod";


export const CategoryCreateSchema = z.object({
     categoryName: z.string({
        error: "CategoryName is required!"
    })
});
