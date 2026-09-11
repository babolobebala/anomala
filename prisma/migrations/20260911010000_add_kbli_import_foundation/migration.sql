CREATE TABLE `master_kbli_temuan` (
    `kode` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,

    PRIMARY KEY (`kode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `kbli` (
    `id` VARCHAR(191) NOT NULL,
    `kbliKey` VARCHAR(191) NOT NULL,
    `assignmentId` VARCHAR(191) NOT NULL,
    `idSubsls` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `statusAlias` VARCHAR(191) NULL,
    `namaAssignment` VARCHAR(191) NULL,
    `nomorBangunan` VARCHAR(191) NULL,
    `idsbr` VARCHAR(191) NULL,
    `linkFasihEdit` VARCHAR(191) NULL,
    `data` TEXT NOT NULL,
    `catatan` TEXT NULL,
    `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kbli_kbliKey_key`(`kbliKey`),
    INDEX `kbli_assignmentId_idx`(`assignmentId`),
    INDEX `kbli_idSubsls_idx`(`idSubsls`),
    INDEX `kbli_kategori_idx`(`kategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `kbli_handling` (
    `assignmentId` VARCHAR(191) NOT NULL,
    `eksekutorId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kbli_handling_eksekutorId_idx`(`eksekutorId`),
    PRIMARY KEY (`assignmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `kbli` ADD CONSTRAINT `kbli_idSubsls_fkey`
    FOREIGN KEY (`idSubsls`) REFERENCES `master_sls`(`idSubsls`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `kbli` ADD CONSTRAINT `kbli_kategori_fkey`
    FOREIGN KEY (`kategori`) REFERENCES `master_kbli_temuan`(`kode`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `kbli_handling` ADD CONSTRAINT `kbli_handling_eksekutorId_fkey`
    FOREIGN KEY (`eksekutorId`) REFERENCES `master_eksekutor`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
