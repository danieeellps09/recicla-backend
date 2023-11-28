/*
  Warnings:

  - You are about to alter the column `created_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `funcaoId` to the `catadores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `catadores` ADD COLUMN `funcaoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `funcoescatador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcao` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `funcoescatador_funcao_key`(`funcao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operadorlogistico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,

    UNIQUE INDEX `operadorlogistico_userId_key`(`userId`),
    UNIQUE INDEX `operadorlogistico_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_funcaoId_fkey` FOREIGN KEY (`funcaoId`) REFERENCES `funcoescatador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operadorlogistico` ADD CONSTRAINT `operadorlogistico_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
