/*
  Warnings:

  - Added the required column `categoryId` to the `specializations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "specializations" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "categories" (
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_categoryName_key" ON "categories"("categoryName");

-- AddForeignKey
ALTER TABLE "specializations" ADD CONSTRAINT "specializations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;
