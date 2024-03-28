
import { Request, Response, NextFunction } from "express";

import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";
import { AuthenticationTypes } from "./AuthenticationTypes";
import { tokenService } from "../services";

const authMethodToUse = process.env.auth_method ?? 'jwt';
console.log('Initialised token middleware to use method:', authMethodToUse);

async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        
        switch (authMethodToUse) {
            case 'jwt':
                return tokenAuthenticate(req, res, next);
        
            case 'mock':
                return mockAuthenticate(req, res, next);

            default:
                throw new Error(`Unknown auth_method configured: "${authMethodToUse}"`);
        }
    
        
    } catch (error) {
        next(error)
    }
}

/**
 * Authenticates IF a header is provided. 
 * This does not reject requests without authentication
 */
async function tokenAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader: string = req.get("Authorization");
        
        if (!authHeader) return next();
        
        if (!authHeader.startsWith("Bearer ")) throw new ErrorMessage(HttpCode.unauthorized, "The Authorization Bearer header is malformed");
        
        const token = authHeader.slice("Bearer ".length);
    
        try {
            const payload = await tokenService.verifyToken(token);
            res.locals.userId = payload.subject;
            res.locals.authenticated = true;
            res.locals.authentication_type = AuthenticationTypes.token;
    
            return next();
        } catch (error) {
            throw new ErrorMessage(HttpCode.unauthorized, "Invalid token");
        }
    } catch (error) {
        next(error);
    }
}

async function mockAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.userId = 1;
        res.locals.authenticated = true;
        res.locals.authentication_type = AuthenticationTypes.mockToken;

        return next();
    } catch (error) {
        next(error);
    }
}

export default {
    authenticate
}