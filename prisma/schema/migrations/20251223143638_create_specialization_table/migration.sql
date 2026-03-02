/*
  Warnings:

  - You are about to drop the column `specialization` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "specialization";

-- CreateTable
CREATE TABLE "specializations" (
    "specializationId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("specializationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "specializations_name_key" ON "specializations"("name");

-- AddForeignKey
ALTER TABLE "specializations" ADD CONSTRAINT "specializations_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE CASCADE ON UPDATE CASCADE;
