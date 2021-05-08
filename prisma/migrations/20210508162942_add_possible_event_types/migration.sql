/*
  Warnings:

  - Changed the type of `type` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('DELIVER', 'OPEN', 'CLICK', 'BOUNCE', 'COMPLAINT', 'REJECT');

-- AlterTable
ALTER TABLE "events" DROP COLUMN "type",
ADD COLUMN     "type" "EventType" NOT NULL;
