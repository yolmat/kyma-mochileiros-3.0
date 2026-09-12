-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'PARCIAL', 'PAGO', 'CANCELADO');

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "emergency" TEXT NOT NULL,
    "useMedication" BOOLEAN NOT NULL DEFAULT false,
    "useMedicationDescription" TEXT,
    "healthProblem" BOOLEAN NOT NULL DEFAULT false,
    "healthProblemDescription" TEXT,
    "foodRestriction" BOOLEAN NOT NULL DEFAULT false,
    "foodRestrictionDescription" TEXT,
    "acceptTheTerms" BOOLEAN NOT NULL,
    "payment" TEXT NOT NULL,
    "amountRegistration" DECIMAL(65,30),
    "amountPaid" DECIMAL(65,30),
    "statusPayment" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
    "datePayment" TEXT,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registrations_cpf_key" ON "registrations"("cpf");

-- CreateIndex
CREATE INDEX "registrations_email_idx" ON "registrations"("email");

-- CreateIndex
CREATE INDEX "registrations_phone_idx" ON "registrations"("phone");

-- CreateIndex
CREATE INDEX "registrations_city_idx" ON "registrations"("city");
