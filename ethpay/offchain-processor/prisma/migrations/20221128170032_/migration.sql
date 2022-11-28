/*
  Warnings:

  - Added the required column `txHash` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderAddress" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "Amount" TEXT NOT NULL,
    "txHash" TEXT NOT NULL
);
INSERT INTO "new_Payment" ("Amount", "Token", "id", "receiverAddress", "senderAddress") SELECT "Amount", "Token", "id", "receiverAddress", "senderAddress" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
