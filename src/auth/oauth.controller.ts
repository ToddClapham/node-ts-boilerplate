import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "./OAuth2Client";
import { dataSource } from "../data-source";
import { UserEntity } from "../user/user.entity";
import { tokenService } from "../services";
import { getEnvVariable } from "../env";


const oauth_url = getEnvVariable('oauth_url');
const client_id = getEnvVariable('client_id');
const client_secret = getEnvVariable('client_secret');
const redirect_url = getEnvVariable('redirect_url');

const oauth2Client = new OAuth2Client(oauth_url, client_id, client_secret, redirect_url);
const userRepo = dataSource.getRepository(UserEntity);

async function getRedirectUrl(req: Request, res: Response, next: NextFunction) {
    try {
        const returnUrl: unknown = req.query.returnUrl || "/";
        if (typeof returnUrl !== 'string') throw new Error("Invalid returnUrl");

        const oauth2SignInUrl = oauth2Client.generateAuthUrl(returnUrl);
        res.send({redirect_url: oauth2SignInUrl});
    } catch (error) {
        next(error)
    }
}

async function oauth2Callback(req: Request, res: Response, next: NextFunction) {
    try {
        const code: string = req.body.code;

        const oauthToken = await oauth2Client.getToken(code);

        const userDetails = await oauth2Client.lookupUser(oauthToken);

        console.log(`${userDetails.email} signed in at ${new Date().toISOString()}`);
        
        let user = await userRepo.findOne({where: {email: userDetails.email}});
        if (!user) {
            throw UserEntity.notFoundError;
        }

        const token = await tokenService.createToken(user);
        
        res.send({token});
    } catch (error) {
        next(error)
    }
}

export default {
    getRedirectUrl,
    oauth2Callback
}