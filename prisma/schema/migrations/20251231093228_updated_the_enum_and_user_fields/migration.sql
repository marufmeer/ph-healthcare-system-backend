/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
DROP COLUMN "isDeleted",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
