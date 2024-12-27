/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `target` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "applicableProducts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "target" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";
