/*
  Warnings:

  - You are about to alter the column `gender` on the `user` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `gender` CHAR(1) NOT NULL;
