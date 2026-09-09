-- CreateTable
CREATE TABLE `master_sls` (
    `idSubsls` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `desa` VARCHAR(191) NOT NULL,
    `namaSls` VARCHAR(191) NOT NULL,
    `ppl` VARCHAR(191) NOT NULL,
    `pml` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idSubsls`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_anomali` (
    `kodeAnomali` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`kodeAnomali`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anomali` (
    `id` VARCHAR(191) NOT NULL,
    `anomalyKey` VARCHAR(191) NOT NULL,
    `assignmentId` VARCHAR(191) NOT NULL,
    `idSubsls` VARCHAR(191) NOT NULL,
    `kodeAnomali` VARCHAR(191) NOT NULL,
    `statusAlias` VARCHAR(191) NULL,
    `namaAssignment` VARCHAR(191) NULL,
    `nomorBangunan` VARCHAR(191) NULL,
    `idsbr` VARCHAR(191) NULL,
    `linkFasihEdit` VARCHAR(191) NULL,
    `data` TEXT NOT NULL,
    `catatan` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isHandled` BOOLEAN NOT NULL DEFAULT false,
    `handledAt` DATETIME(3) NULL,
    `handledBy` VARCHAR(191) NULL,
    `handlingNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `anomali_anomalyKey_key`(`anomalyKey`),
    INDEX `anomali_assignmentId_idx`(`assignmentId`),
    INDEX `anomali_idSubsls_idx`(`idSubsls`),
    INDEX `anomali_kodeAnomali_idx`(`kodeAnomali`),
    INDEX `anomali_isActive_idx`(`isActive`),
    INDEX `anomali_isHandled_idx`(`isHandled`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `anomali` ADD CONSTRAINT `anomali_idSubsls_fkey` FOREIGN KEY (`idSubsls`) REFERENCES `master_sls`(`idSubsls`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anomali` ADD CONSTRAINT `anomali_kodeAnomali_fkey` FOREIGN KEY (`kodeAnomali`) REFERENCES `master_anomali`(`kodeAnomali`) ON DELETE RESTRICT ON UPDATE CASCADE;
