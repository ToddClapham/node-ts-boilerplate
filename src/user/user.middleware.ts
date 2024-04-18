import { Request, Response, NextFunction } from "express";
import { userService } from "../services";

async function attachUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: number = +req.params.userId;

        const user = await userService.getUserById(userId);

        res.locals.user = user;

        next();

    } catch (error) {
        next(error);
    }
}

export default {
    attachUser
}