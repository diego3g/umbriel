/*
  Warnings:

  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "sender_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "senders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "senders.email_unique" ON "senders"("email");

-- AddForeignKey
ALTER TABLE "messages" ADD FOREIGN KEY ("sender_id") REFERENCES "senders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
