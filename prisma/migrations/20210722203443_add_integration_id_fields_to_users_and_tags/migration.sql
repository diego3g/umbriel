/*
  Warnings:

  - A unique constraint covering the columns `[integration_id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[integration_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `integration_id` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integration_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "integration_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "integration_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tags.integration_id_unique" ON "tags"("integration_id");

-- CreateIndex
CREATE UNIQUE INDEX "users.integration_id_unique" ON "users"("integration_id");
