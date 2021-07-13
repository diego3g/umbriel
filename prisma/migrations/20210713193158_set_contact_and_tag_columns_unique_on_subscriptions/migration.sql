/*
  Warnings:

  - A unique constraint covering the columns `[contact_id,tag_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscriptions.contact_id_tag_id_unique" ON "subscriptions"("contact_id", "tag_id");
