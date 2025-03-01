-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "transactionSign" DROP NOT NULL,
ALTER COLUMN "paidToken" DROP NOT NULL;
