-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "registrationNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
