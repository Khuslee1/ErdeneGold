/*
  Warnings:

  - A unique constraint covering the columns `[title,departmentId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Question_title_departmentId_key" ON "Question"("title", "departmentId");
