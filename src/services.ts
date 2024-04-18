import { OAuth2Client } from "./auth/OAuth2Client";
import { TokenService } from "./auth/token.service";
import { dataSource } from "./data-source";
import { getEnvVariable } from "./env";
import { UserEntity } from "./user/user.entity";
import { UserService } from "./user/user.service";

const privateKey = getEnvVariable('jwt_secret');

export const tokenService = new TokenService(privateKey);

const oauth_url = getEnvVariable('oauth_url');
const client_id = getEnvVariable('client_id');
const client_secret = getEnvVariable('client_secret');
const redirect_url = getEnvVariable('redirect_url');

export const oauth2Client = new OAuth2Client(oauth_url, client_id, client_secret, redirect_url);

export const userService = new UserService(
    dataSource.getRepository(UserEntity),
);