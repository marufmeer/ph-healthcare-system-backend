import { PrismaClient } from "@prisma/client"
import { envVars } from "../config"
import { PrismaPg } from "@prisma/adapter-pg"


const adapter=new PrismaPg({
    connectionString:envVars.DATABASE_URL
})
export const prisma=new PrismaClient({adapter})
