/*
  Warnings:

  - You are about to drop the column `analyticsDomain` on the `Website` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServiceConfigType" AS ENUM ('POSTHOG', 'RESEND', 'CLOUDFLARE');

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "analyticsDomain";

-- CreateTable
CREATE TABLE "ServiceConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "type" "ServiceConfigType" NOT NULL,
    "domainId" TEXT,
    "websiteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceConfig_domainId_idx" ON "ServiceConfig"("domainId");

-- CreateIndex
CREATE INDEX "ServiceConfig_websiteId_idx" ON "ServiceConfig"("websiteId");

-- AddForeignKey
ALTER TABLE "ServiceConfig" ADD CONSTRAINT "ServiceConfig_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceConfig" ADD CONSTRAINT "ServiceConfig_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;
