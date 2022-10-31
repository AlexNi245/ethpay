/*
  Warnings:

  - You are about to drop the column `message` on the `User` table. All the data in the column will be lost.
  - Added the required column `messageSignature` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "messageSignature" TEXT NOT NULL,
    "paymentsId" INTEGER,
    CONSTRAINT "User_paymentsId_fkey" FOREIGN KEY ("paymentsId") REFERENCES "Payments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("address", "id", "paymentsId") SELECT "address", "id", "paymentsId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
