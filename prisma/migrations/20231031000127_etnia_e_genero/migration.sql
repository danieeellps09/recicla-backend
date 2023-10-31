/*
  Warnings:

  - You are about to alter the column `created_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `etniaId` to the `catadores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generoId` to the `catadores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `catadores` ADD COLUMN `etniaId` INTEGER NOT NULL,
    ADD COLUMN `generoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `genero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomenclatura` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etnia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomenclatura` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_generoId_fkey` FOREIGN KEY (`generoId`) REFERENCES `genero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_etniaId_fkey` FOREIGN KEY (`etniaId`) REFERENCES `etnia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
