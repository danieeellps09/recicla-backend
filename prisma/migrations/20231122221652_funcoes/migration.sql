/*
  Warnings:

  - You are about to alter the column `created_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Made the column `funcaoId` on table `catadores` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `catadores` DROP FOREIGN KEY `catadores_funcaoId_fkey`;

-- AlterTable
ALTER TABLE `catadores` MODIFY `funcaoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_funcaoId_fkey` FOREIGN KEY (`funcaoId`) REFERENCES `funcoescatador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
