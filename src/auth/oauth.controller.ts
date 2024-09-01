import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../user/user.entity";
import { oauth2Client, tokenService, userService } from "../services";
import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";

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
        
        let user = await userService.getUserByEmail(userDetails.email);
        if (!user) throw new ErrorMessage(HttpCode.badRequest, "User not found");

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