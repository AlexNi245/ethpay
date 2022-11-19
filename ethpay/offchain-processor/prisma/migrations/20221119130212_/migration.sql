-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderAddress" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "Amount" TEXT NOT NULL
);
INSERT INTO "new_Payments" ("Amount", "Token", "id", "receiverAddress", "senderAddress") SELECT "Amount", "Token", "id", "receiverAddress", "senderAddress" FROM "Payments";
DROP TABLE "Payments";
ALTER TABLE "new_Payments" RENAME TO "Payments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
