-- CreateTable
CREATE TABLE "application_history" (
    "id" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "application_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_history_applicationId_idx" ON "application_history"("applicationId");

-- CreateIndex
CREATE INDEX "application_history_changedAt_idx" ON "application_history"("changedAt");

-- AddForeignKey
ALTER TABLE "application_history" ADD CONSTRAINT "application_history_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
