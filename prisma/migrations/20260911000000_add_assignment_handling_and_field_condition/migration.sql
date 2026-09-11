-- CreateTable
CREATE TABLE `master_eksekutor` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignment_handling` (
    `assignmentId` VARCHAR(191) NOT NULL,
    `eksekutorId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `assignment_handling_eksekutorId_idx`(`eksekutorId`),
    PRIMARY KEY (`assignmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `anomali`
    ADD COLUMN `isSesuaiLapangan` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sesuaiLapanganAt` DATETIME(3) NULL,
    ADD INDEX `anomali_isSesuaiLapangan_idx`(`isSesuaiLapangan`);

-- AddForeignKey
ALTER TABLE `assignment_handling` ADD CONSTRAINT `assignment_handling_eksekutorId_fkey` FOREIGN KEY (`eksekutorId`) REFERENCES `master_eksekutor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
