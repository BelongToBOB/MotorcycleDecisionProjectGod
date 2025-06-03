-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `occupation` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MotoType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moto_type_name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Motorcycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moto_name` VARCHAR(45) NOT NULL,
    `moto_brand` VARCHAR(30) NOT NULL,
    `moto_weight` VARCHAR(25) NOT NULL,
    `moto_cc` VARCHAR(30) NOT NULL,
    `maintenance_cost` VARCHAR(30) NOT NULL,
    `consumption_rate` VARCHAR(30) NOT NULL,
    `moto_content` TEXT NOT NULL,
    `moto_price` VARCHAR(30) NOT NULL,
    `moto_view` INTEGER NULL,
    `moto_type_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Motorcycle` ADD CONSTRAINT `Motorcycle_moto_type_id_fkey` FOREIGN KEY (`moto_type_id`) REFERENCES `MotoType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
