-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "subscriptionExpiryDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recruiter" ADD COLUMN     "subscriptionExpiryDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "candidateId" TEXT,
    "recruiterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_candidateId_idx" ON "Notification"("candidateId");

-- CreateIndex
CREATE INDEX "Notification_recruiterId_idx" ON "Notification"("recruiterId");

-- CreateIndex
CREATE INDEX "Recruiter_subscriptionExpiryDate_idx" ON "Recruiter"("subscriptionExpiryDate");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
