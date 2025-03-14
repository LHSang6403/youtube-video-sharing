/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId]` on the table `Share` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "idx_share_userId" ON "Share"("userId");

-- CreateIndex
CREATE INDEX "idx_share_videoId" ON "Share"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Share_userId_videoId_key" ON "Share"("userId", "videoId");

-- CreateIndex
CREATE INDEX "idx_video_userId" ON "Video"("userId");

-- CreateIndex
CREATE INDEX "idx_video_createdAt" ON "Video"("createdAt");
