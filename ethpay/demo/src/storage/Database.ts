export interface PaymentDto {
    name: string;
    id: string;
    createdAt: Date;
}
export class Database {
    private readonly sessionKey = "ETHPAY_AUTH_STORAGE";
    private readonly itemsKey = "ETHPAY_ITEMS";

    public login(address: string, token: string) {
        const oldItems = JSON.parse(
            localStorage.getItem(this.sessionKey) ?? "{}"
        );

        const newItems = {
            ...oldItems,
            [address]: token,
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(newItems));
    }

    public getSession(address: string): string | undefined {
        const allSessions = JSON.parse(
            localStorage.getItem(this.sessionKey) ?? "{}"
        );

        const session = allSessions[address];

        if (!session) {
            return undefined;
        }

        return session.jwt;
    }

    public addItem(address: string, name: string, id: string) {
        const oldUsers = JSON.parse(
            localStorage.getItem(this.itemsKey) ?? "{}"
        );

        const oldItems = oldUsers[address] ?? [];

        const newItems = [
            ...oldItems,
            {
                name,
                id,
                createdAt: new Date(),
            } as PaymentDto,
        ];

        const newUsers = {
            ...oldUsers,
            [address]: newItems,
        };
        console.log(newUsers);
        localStorage.setItem(this.itemsKey, JSON.stringify(newUsers));
    }

    public getItems() {
        const itemsString = localStorage.getItem(this.itemsKey);
        const users = JSON.parse(itemsString ?? "{}");

        const keys = Object.keys(users);

        const items = keys.reduce(
            (cur, agg) => [...cur, ...users[agg]],
            [] as any[]
        );


        return items;
    }
}
