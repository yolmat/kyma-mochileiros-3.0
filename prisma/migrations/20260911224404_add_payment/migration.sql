/*
  Warnings:

  - You are about to drop the column `dataPagamento` on the `registrations` table. All the data in the column will be lost.
  - You are about to drop the column `statusPagamento` on the `registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "registrations" DROP COLUMN "dataPagamento",
DROP COLUMN "statusPagamento",
ADD COLUMN     "datePayment" TEXT,
ADD COLUMN     "statusPayment" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
ALTER COLUMN "payment" SET DEFAULT 'PIX';
