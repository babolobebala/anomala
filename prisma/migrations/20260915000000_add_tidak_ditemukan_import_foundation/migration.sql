-- CreateTable
CREATE TABLE `tidak_ditemukan_assignment` (
    `id` VARCHAR(191) NOT NULL,
    `idSubsls` VARCHAR(191) NOT NULL,
    `namaAssignment` VARCHAR(191) NOT NULL,

    INDEX `tidak_ditemukan_assignment_idSubsls_idx`(`idSubsls`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tidak_ditemukan_slsstatus` (
    `idSubsls` VARCHAR(191) NOT NULL,
    `isSelesai` BOOLEAN NOT NULL DEFAULT false,
    `selesaiAt` DATETIME(3) NULL,

    PRIMARY KEY (`idSubsls`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tidak_ditemukan_waktu_import` (
    `id` VARCHAR(191) NOT NULL,
    `importedAt` DATETIME(3) NOT NULL,
    `namaFile` VARCHAR(191) NOT NULL,
    `jumlahAssignment` INTEGER NOT NULL,
    `jumlahSls` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tidak_ditemukan_assignment` ADD CONSTRAINT `tidak_ditemukan_assignment_idSubsls_fkey` FOREIGN KEY (`idSubsls`) REFERENCES `master_sls`(`idSubsls`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tidak_ditemukan_slsstatus` ADD CONSTRAINT `tidak_ditemukan_slsstatus_idSubsls_fkey` FOREIGN KEY (`idSubsls`) REFERENCES `master_sls`(`idSubsls`) ON DELETE RESTRICT ON UPDATE CASCADE;
