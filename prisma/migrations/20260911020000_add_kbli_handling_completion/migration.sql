-- AlterTable
ALTER TABLE `kbli`
    ADD COLUMN `isHandled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `handledAt` DATETIME(3) NULL,
    ADD INDEX `kbli_isHandled_idx`(`isHandled`);
