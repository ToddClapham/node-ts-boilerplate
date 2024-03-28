import { HttpCode } from "./HttpCodes";

export default class ErrorMessage extends Error {
    
    customErrorMessage = true;
    httpStatus: HttpCode;

    constructor(status: HttpCode = 500, message = "Server error") {
        super(message);
        this.httpStatus = status;
    }
}