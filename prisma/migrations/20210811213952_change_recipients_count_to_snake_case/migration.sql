/*
  Warnings:

  - You are about to drop the column `recipientsCount` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "recipientsCount",
ADD COLUMN     "recipients_count" INTEGER NOT NULL DEFAULT 0;
