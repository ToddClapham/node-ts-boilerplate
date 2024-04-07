import axios, { AxiosInstance } from 'axios';

export class OAuth2Client {

    private readonly axios: AxiosInstance;

    constructor(
        private readonly oauth_url: string, 
        private readonly client_id: string, 
        private readonly client_secret: string, 
        private readonly redirect_url: string
    ) {
        if (!oauth_url) throw new Error("oauth_url must be provided");
        this.axios = axios.create({
            baseURL: oauth_url
        })
    }

    generateAuthUrl(returnUrl: string): string {
        let state = returnUrl // where to redirect to after login

        const params = new URLSearchParams();
        params.append('client_id', this.client_id);
        params.append('response_type', "authorization_code");
        params.append('redirect_uri', this.redirect_url);
        params.append('state', state);

        return `${this.oauth_url}/oauth/authorise?${params.toString()}`;
    }

    async getToken(code: string): Promise<string> {

        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', this.client_id);
        params.append('client_secret', this.client_secret);
        params.append('redirect_uri', this.redirect_url);
        params.append('grant_type', "authorization_code");
    
        // get the oauth token
        const oauthResponse = await this.axios.post(`/oauth/token`, params);
        
        return oauthResponse.data.token;
    }

    async lookupUser(token: string): Promise<IOAuthUser> {
        // lookup the user's details using the token
        let userResponse = await this.axios.get(`/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        let {email, firstname, lastname, admin} = userResponse.data;
        return {email, firstname, lastname, admin};
    }
}

interface IOAuthUser {
    email: string;
    firstname: string;
    lastname: string;
    admin: boolean;
}