-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    UNIQUE INDEX `UserRole_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catadores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `associacaoId` INTEGER NOT NULL,
    `generoId` INTEGER NOT NULL,
    `etniaId` INTEGER NOT NULL,
    `funcaoId` INTEGER NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `bairro` VARCHAR(255) NOT NULL,
    `endereco` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `catadores_userId_key`(`userId`),
    UNIQUE INDEX `catadores_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomenclatura` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `genero_nomenclatura_key`(`nomenclatura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etnia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomenclatura` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `etnia_nomenclatura_key`(`nomenclatura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `funcoescatador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcao` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `funcoescatador_funcao_key`(`funcao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veiculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeVeiculo` VARCHAR(255) NULL,

    UNIQUE INDEX `veiculos_nomeVeiculo_key`(`nomeVeiculo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `associacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `associacoes_userId_key`(`userId`),
    UNIQUE INDEX `associacoes_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `materiais_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,

    UNIQUE INDEX `administrador_userId_key`(`userId`),
    UNIQUE INDEX `administrador_cpf_key`(`cpf`),
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

-- CreateTable
CREATE TABLE `coletas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` INTEGER NOT NULL,
    `pergunta` BOOLEAN NOT NULL,
    `motivo` VARCHAR(191) NOT NULL,
    `numRota` INTEGER NOT NULL,
    `idCatador` INTEGER NOT NULL,
    `idAssociacao` INTEGER NOT NULL,
    `idVeiculo` INTEGER NOT NULL,
    `dataColeta` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idAssociacao` INTEGER NOT NULL,
    `empresaCompradora` VARCHAR(191) NOT NULL,
    `notaFiscal` VARCHAR(191) NOT NULL,
    `dataVenda` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `vendas_notaFiscal_key`(`notaFiscal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaProduto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idVenda` INTEGER NOT NULL,
    `idMaterial` INTEGER NOT NULL,
    `quantidadeVendida` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_associacaoId_fkey` FOREIGN KEY (`associacaoId`) REFERENCES `associacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_generoId_fkey` FOREIGN KEY (`generoId`) REFERENCES `genero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_etniaId_fkey` FOREIGN KEY (`etniaId`) REFERENCES `etnia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catadores` ADD CONSTRAINT `catadores_funcaoId_fkey` FOREIGN KEY (`funcaoId`) REFERENCES `funcoescatador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `associacoes` ADD CONSTRAINT `associacoes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `administrador` ADD CONSTRAINT `administrador_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operadorlogistico` ADD CONSTRAINT `operadorlogistico_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coletas` ADD CONSTRAINT `coletas_idCatador_fkey` FOREIGN KEY (`idCatador`) REFERENCES `catadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coletas` ADD CONSTRAINT `coletas_idAssociacao_fkey` FOREIGN KEY (`idAssociacao`) REFERENCES `associacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coletas` ADD CONSTRAINT `coletas_idVeiculo_fkey` FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendas` ADD CONSTRAINT `vendas_idAssociacao_fkey` FOREIGN KEY (`idAssociacao`) REFERENCES `associacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaProduto` ADD CONSTRAINT `VendaProduto_idVenda_fkey` FOREIGN KEY (`idVenda`) REFERENCES `vendas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaProduto` ADD CONSTRAINT `VendaProduto_idMaterial_fkey` FOREIGN KEY (`idMaterial`) REFERENCES `materiais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
