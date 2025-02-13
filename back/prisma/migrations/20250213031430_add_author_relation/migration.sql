/*
  Warnings:

  - Added the required column `authorId` to the `Tarefa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tarefa` ADD COLUMN `authorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'colaborador';

-- AddForeignKey
ALTER TABLE `Tarefa` ADD CONSTRAINT `Tarefa_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
