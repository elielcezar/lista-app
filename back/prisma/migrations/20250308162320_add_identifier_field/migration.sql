-- Modificar para tornar a coluna nullable inicialmente
ALTER TABLE `User` ADD COLUMN `identifier` VARCHAR(191) NULL;

-- Atualizar os registros existentes, copiando o valor de email para identifier
UPDATE `User` SET `identifier` = `email`;

-- Depois de preencher todos os registros, tornar a coluna NOT NULL
ALTER TABLE `User` MODIFY COLUMN `identifier` VARCHAR(191) NOT NULL;

-- Adicionar a restrição UNIQUE
ALTER TABLE `User` ADD UNIQUE INDEX `User_identifier_key`(`identifier`);