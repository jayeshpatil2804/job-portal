-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "benefits" TEXT,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRemote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobType" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "responsibilities" TEXT,
ADD COLUMN     "skills" TEXT;
