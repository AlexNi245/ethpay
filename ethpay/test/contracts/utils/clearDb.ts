import { PrismaClient } from "@prisma/client";

export const clearDb = async () => {
    const db = new PrismaClient();
    const deleteUser =  db.user.deleteMany();
    const deletePayments =  db.payment.deleteMany();

    await db.$transaction([deleteUser, deletePayments]);
};
