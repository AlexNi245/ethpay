export class Database {
    private readonly sessionKey = "ETHPAY_AUTH_STORAGE";

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

        return allSessions[address];
    }
}
