/*
  Warnings:

  - You are about to drop the `_ContactToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ContactToTag" DROP CONSTRAINT "_ContactToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToTag" DROP CONSTRAINT "_ContactToTag_B_fkey";

-- DropTable
DROP TABLE "_ContactToTag";

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscriptions" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
