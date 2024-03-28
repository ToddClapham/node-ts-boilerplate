import { TokenService } from "./auth/token.service";
import { getEnvVariable } from "./env";

const privateKey = getEnvVariable('jwt_secret');

export const tokenService = new TokenService(privateKey);