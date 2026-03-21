/*
  Warnings:

  - Added the required column `hour` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "allowedHours" INTEGER[];

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "hour" INTEGER NOT NULL;
