/*
  Warnings:

  - You are about to alter the column `moto_weight` on the `motorcycle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(25)` to `Float`.
  - You are about to alter the column `moto_cc` on the `motorcycle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Int`.
  - You are about to alter the column `maintenance_cost` on the `motorcycle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Int`.
  - You are about to alter the column `consumption_rate` on the `motorcycle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Float`.
  - You are about to alter the column `moto_price` on the `motorcycle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `motorcycle` MODIFY `moto_weight` FLOAT NOT NULL,
    MODIFY `moto_cc` INTEGER NOT NULL,
    MODIFY `maintenance_cost` INTEGER NOT NULL,
    MODIFY `consumption_rate` FLOAT NOT NULL,
    MODIFY `moto_price` INTEGER NOT NULL;
