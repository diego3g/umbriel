/*
  Warnings:

  - A unique constraint covering the columns `[message_id,contact_id]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recipients.message_id_contact_id_unique" ON "recipients"("message_id", "contact_id");
