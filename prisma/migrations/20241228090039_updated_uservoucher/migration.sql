-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "allowedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxUsesPerUser" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "redeemableDays" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "user_vouchers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "voucherId" INTEGER NOT NULL,
    "redeemedAt" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
    "useCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_vouchers_userId_voucherId_key" ON "user_vouchers"("userId", "voucherId");

-- AddForeignKey
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
