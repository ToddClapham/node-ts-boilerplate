import { Request, Response, NextFunction } from "express";
import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";
import { userService } from "../services";

async function attachOwnAccount(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: string = res.locals.userId;
    
        const user = await userService.getUserById(+userId);
        if (!user) throw new ErrorMessage(HttpCode.badRequest, "Account not found");
    
        res.locals.ownAccount = user;

        // Set the user's permissions here?
        
        next();
    } catch (error) {
        next(error);
    }
}

export default {
    attachOwnAccount,
}