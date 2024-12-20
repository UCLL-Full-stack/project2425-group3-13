/*
  Warnings:

  - You are about to drop the column `isAdministrator` on the `User` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'bank');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdministrator",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "_UserAccounts" ADD CONSTRAINT "_UserAccounts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserAccounts_AB_unique";
