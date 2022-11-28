import axios from "axios";
import { Database } from "../storage/Database";

export class HttpClient {
    private readonly BASE_URL = "http://localhost:3010";

    private getAuthHeader(address: string) {
        return {
            Authorization: new Database().getSession(address)!,
        };
    }

    public async sendPayment(
        sender: string,
        token: string,
        receiver: string,
        amount: string
    ) {
        try {
            const url = `${this.BASE_URL}/payment`;

            const res = await axios.post(
                url,
                {
                    token,
                    amount,
                    receiver,
                },
                { headers: this.getAuthHeader(sender) }
            );

            return res.data;
        } catch (e:any) {
            console.log(e);
            return e.response.data;
        }
    }

    public async getPaymentById(id: string) {
        try {
            const url = `${this.BASE_URL}/payment/id/${id}`;
            const res = await axios.get(url);

            return res.data.payment;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    public login(address: string, messageSignature: string) {
        try {
            const url = `${this.BASE_URL}/login/`;
            return axios.post(url, { address, messageSignature });
        } catch (err) {
            console.log(err);
        }
    }
}
