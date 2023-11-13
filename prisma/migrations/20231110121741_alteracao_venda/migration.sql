/*
  Warnings:

  - You are about to alter the column `created_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `qtdVendida` on the `vendas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `vendas` DROP COLUMN `qtdVendida`;

-- CreateTable
CREATE TABLE `VendaProduto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idVenda` INTEGER NOT NULL,
    `idMaterial` INTEGER NOT NULL,
    `quantidadeVendida` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendaProduto` ADD CONSTRAINT `VendaProduto_idVenda_fkey` FOREIGN KEY (`idVenda`) REFERENCES `vendas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaProduto` ADD CONSTRAINT `VendaProduto_idMaterial_fkey` FOREIGN KEY (`idMaterial`) REFERENCES `materiais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
