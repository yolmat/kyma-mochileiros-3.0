/*
  Warnings:

  - Changed the type of `payment` on the `registrations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CARTAO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'PARCIAL', 'PAGO', 'CANCELADO');

-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "amountPaid" DECIMAL(65,30),
ADD COLUMN     "amountRegistration" DECIMAL(65,30),
ADD COLUMN     "dataPagamento" TIMESTAMP(3),
ADD COLUMN     "statusPagamento" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
ALTER COLUMN "acceptTheTerms" DROP DEFAULT,
DROP COLUMN "payment",
ADD COLUMN     "payment" "PaymentMethod" NOT NULL;
