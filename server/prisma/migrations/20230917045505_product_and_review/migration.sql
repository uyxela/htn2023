/*
  Warnings:

  - You are about to drop the column `keywords` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `summary` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snippet` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "keywords" STRING[];
ALTER TABLE "products" ADD COLUMN     "summary" STRING NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "keywords";
ALTER TABLE "reviews" DROP COLUMN "summary";
ALTER TABLE "reviews" ADD COLUMN     "snippet" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_title_key" ON "reviews"("title");
