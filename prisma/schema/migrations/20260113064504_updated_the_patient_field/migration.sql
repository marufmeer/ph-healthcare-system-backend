/*
  Warnings:

  - You are about to drop the column `allergies` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistory` on the `patients` table. All the data in the column will be lost.
  - Made the column `registrationNumber` on table `assistants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registrationNumber` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bloodGroup` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Made the column `height` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'B_POSITIVE', 'O_POSITIVE', 'AB_POSITIVE', 'A_NEGATIVE', 'B_NEGATIVE', 'O_NEGATIVE', 'AB_NEGATIVE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('MARRIED', 'UNMARRIED');

-- AlterTable
ALTER TABLE "assistants" ALTER COLUMN "registrationNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "registrationNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "allergies",
DROP COLUMN "medicalHistory",
ADD COLUMN     "dietaryPreferences" TEXT,
ADD COLUMN     "hasAllergies" BOOLEAN DEFAULT false,
ADD COLUMN     "hasDiabetes" BOOLEAN DEFAULT false,
ADD COLUMN     "hasPastSurgeries" BOOLEAN DEFAULT false,
ADD COLUMN     "immunizationStatus" TEXT,
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'UNMARRIED',
ADD COLUMN     "mentalHealthHistory" TEXT,
ADD COLUMN     "pregnancyStatus" BOOLEAN DEFAULT false,
ADD COLUMN     "recentAnxiety" BOOLEAN DEFAULT false,
ADD COLUMN     "recentDepression" BOOLEAN DEFAULT false,
ADD COLUMN     "smokingStatus" BOOLEAN DEFAULT false,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
DROP COLUMN "bloodGroup",
ADD COLUMN     "bloodGroup" "BloodGroup" NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "height" SET DATA TYPE TEXT,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "weight" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "medical_reports" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("patientId") ON DELETE RESTRICT ON UPDATE CASCADE;
