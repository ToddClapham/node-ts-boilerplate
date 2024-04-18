import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";

export class User {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public isAdmin: boolean,
    ) {

    }

    static get notFoundError() {
        return new ErrorMessage(HttpCode.notFound, "User not found");
    }
}