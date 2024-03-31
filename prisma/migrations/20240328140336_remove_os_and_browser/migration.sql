/*
  Warnings:

  - You are about to drop the column `browser` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "browser",
DROP COLUMN "os";
