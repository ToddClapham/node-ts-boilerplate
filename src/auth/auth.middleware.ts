
import { Request, Response, NextFunction } from "express";
import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";

async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
        if (res.locals.authenticated !== true) {
            throw new ErrorMessage(HttpCode.unauthorized, "No authentication provided");
        }
        next();
    } catch (error) {
        next(error);
    }
}

function hasAuthenticationType(types: string[] = []) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (types.includes(res.locals.authentication_type)) {
                return next();
            }
            throw new ErrorMessage(HttpCode.forbidden, "Provided credentials are insufficient");
        } catch (error) {
            next(error);
        }
    }
}

export default {
    isAuthenticated,
    hasAuthenticationType
}