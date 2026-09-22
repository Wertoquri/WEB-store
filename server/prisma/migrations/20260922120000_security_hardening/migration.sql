ALTER TABLE "User" ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Product" ADD COLUMN "imagePublicId" TEXT;
ALTER TABLE "Product" ADD COLUMN "imageResourceType" TEXT;

ALTER TABLE "Review" ADD COLUMN "mediaAssets" TEXT;
CREATE INDEX "Review_productId_idx" ON "Review"("productId");
