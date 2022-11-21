import axios from "axios";

export class HttpClient {
    private readonly BASE_URL = "http://localhost:3010";

    public login(address: string, messageSignature: string) {
        try {
            const url = `${this.BASE_URL}/login/`;
            return axios.post(url, { address, messageSignature });
        } catch (err) {
            console.log(err);
        }
    }
}
