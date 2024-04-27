import * as express from "express";
const router = express.Router();
const json = express.json();

import accountMiddleware from "../auth/ownAccount.middleware";
import userMiddleware from "./user.middleware";

import usersController from "./user.controller";

router.use('/users/:userId', userMiddleware.attachUser);

router.get(   '/account', accountMiddleware.attachOwnAccount, usersController.getOwnAccount);
router.post(  '/users', json, usersController.createUser);
router.get(   '/users', usersController.getUsers);
router.put(   '/users/:userId', json, usersController.updateUser);
router.delete('/users/:userId', usersController.deleteUser);

export default router;