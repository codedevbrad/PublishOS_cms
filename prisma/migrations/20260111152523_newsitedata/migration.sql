/*
  Warnings:

  - You are about to drop the column `siteData` on the `Website` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Website" DROP COLUMN "siteData";

-- CreateTable
CREATE TABLE "WebsiteCreation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteData" JSONB NOT NULL,
    "websiteId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteCreation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebsiteCreation_websiteId_isActive_idx" ON "WebsiteCreation"("websiteId", "isActive");

-- AddForeignKey
ALTER TABLE "WebsiteCreation" ADD CONSTRAINT "WebsiteCreation_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
