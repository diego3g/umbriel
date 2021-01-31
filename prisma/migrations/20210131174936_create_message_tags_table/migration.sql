/*
  Warnings:

  - You are about to drop the `_MessageToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MessageToTag" DROP CONSTRAINT "_MessageToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToTag" DROP CONSTRAINT "_MessageToTag_B_fkey";

-- CreateTable
CREATE TABLE "message_tags" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "_MessageToTag";

-- AddForeignKey
ALTER TABLE "message_tags" ADD FOREIGN KEY("message_id")REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_tags" ADD FOREIGN KEY("tag_id")REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
