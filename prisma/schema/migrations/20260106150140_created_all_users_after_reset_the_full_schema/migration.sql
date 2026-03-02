/*
  Warnings:

  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "roles" (
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" "UserRole" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_userId_name_key" ON "roles"("userId", "name");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
