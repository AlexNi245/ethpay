/*
  Warnings:

  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `paymentsId` on the `User` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Payments";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderAddress" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "Amount" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "messageSignature" TEXT NOT NULL,
    "paymentId" INTEGER,
    CONSTRAINT "User_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("address", "id", "messageSignature") SELECT "address", "id", "messageSignature" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
