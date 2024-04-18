import { NextFunction, Request, Response } from "express";
import { UserDTOMapper } from "./userDTOMapper";
import { User } from "./User";
import { NewUserDTO } from "./newUserDTO";
import { userService } from "../services";

async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const newUser: NewUserDTO = req.body;

        const user = await userService.createUser(newUser);

        const userDTO = UserDTOMapper.fromModel(user);

        res.send(userDTO);
    } catch (error) {
        next(error);
    }
}

async function getOwnAccount(req: Request, res: Response, next: NextFunction) {
    try {
        const ownAccount = res.locals.ownAccount;
        res.send(ownAccount);
    } catch (error) {
        next(error);
    }
}

async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getUsers();

        const userDTOs = users.map(x => UserDTOMapper.fromModel(x));

        res.send(userDTOs);
    } catch (error) {
        next(error);
    }
}

async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = +req.params.userId;
        const user = await userService.getUserById(userId);

        const userDTO = UserDTOMapper.fromModel(user);

        res.send(userDTO);
    } catch (error) {
        next(error);
    }
}

async function getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const userEmail = req.params.userEmail;
        const user = await userService.getUserByEmail(userEmail);

        const userDTO = UserDTOMapper.fromModel(user);

        res.send(userDTO);
    } catch (error) {
        next(error);
    }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user: User = res.locals.user;
        const userUpdate = req.body;

        // todo - validation of updated User

        const updatedUser = await userService.updateUser(user, userUpdate);

        const userDTO = UserDTOMapper.fromModel(updatedUser);

        res.send(userDTO);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user: User = res.locals.user;

        await userService.deleteUser(user);

        const userDTO = UserDTOMapper.fromModel(user);

        res.send(userDTO);
    } catch (error) {
        next(error);
    }
}

export default {
    createUser,
    getOwnAccount,
    getUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
}