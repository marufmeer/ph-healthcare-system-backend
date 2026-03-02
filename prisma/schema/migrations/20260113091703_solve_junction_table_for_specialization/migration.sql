/*
  Warnings:

  - You are about to drop the column `doctorId` on the `specializations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "specializations" DROP CONSTRAINT "specializations_doctorId_fkey";

-- AlterTable
ALTER TABLE "specializations" DROP COLUMN "doctorId";

-- CreateTable
CREATE TABLE "doctor_specializations" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "doctor_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specializations_doctorId_specializationId_key" ON "doctor_specializations"("doctorId", "specializationId");

-- AddForeignKey
ALTER TABLE "doctor_specializations" ADD CONSTRAINT "doctor_specializations_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specializations" ADD CONSTRAINT "doctor_specializations_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("specializationId") ON DELETE CASCADE ON UPDATE CASCADE;
