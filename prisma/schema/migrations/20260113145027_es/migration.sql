/*
  Warnings:

  - You are about to drop the column `departmentName` on the `assistants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,categoryId]` on the table `specializations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "assistants" DROP COLUMN "departmentName";

-- CreateTable
CREATE TABLE "assistant_specializations" (
    "id" TEXT NOT NULL,
    "assistantId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "assistant_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assistant_specializations_assistantId_specializationId_key" ON "assistant_specializations"("assistantId", "specializationId");

-- CreateIndex
CREATE INDEX "specializations_categoryId_idx" ON "specializations"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_name_categoryId_key" ON "specializations"("name", "categoryId");

-- AddForeignKey
ALTER TABLE "assistant_specializations" ADD CONSTRAINT "assistant_specializations_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "assistants"("assistantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistant_specializations" ADD CONSTRAINT "assistant_specializations_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("specializationId") ON DELETE CASCADE ON UPDATE CASCADE;
