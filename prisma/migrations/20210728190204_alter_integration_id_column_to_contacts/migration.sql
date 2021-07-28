/*
  Warnings:

  - You are about to drop the column `integration_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[integration_id]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users.integration_id_unique";

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "integration_id" TEXT;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "integration_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "integration_id";

-- CreateIndex
CREATE UNIQUE INDEX "contacts.integration_id_unique" ON "contacts"("integration_id");
