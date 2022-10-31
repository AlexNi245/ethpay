/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderAddress" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "Amount" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "paymentsId" INTEGER,
    CONSTRAINT "User_paymentsId_fkey" FOREIGN KEY ("paymentsId") REFERENCES "Payments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
