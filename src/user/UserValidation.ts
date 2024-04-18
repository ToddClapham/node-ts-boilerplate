import { Repository } from "typeorm";
import { UserEntity } from "./User.entity";
import { NewUserDTO } from "./newUserDTO";

export class UserValidation {

    constructor(
        private readonly userRepo: Repository<UserEntity>,
    ) {

    }
    async validateNew(userInfo: NewUserDTO): Promise<string[]> {
        const validationIssues: string[] = [];

        const existingUser = await this.userRepo.find({
            where: {
                email: userInfo.email
            }
        })
        if (existingUser.length > 0) validationIssues.push("User with this email already exists");
         
        console.warn("More user validation required?")

        return validationIssues;
    }

    async validateUpdate(userInfo: any): Promise<string[]> {
        const validationIssues: string[] = [];

        const existingUser = await this.userRepo.findOne({where: {email: userInfo.email}});
        if (existingUser && existingUser.id !== userInfo.id) {
            validationIssues.push("Email is in use by another user");
        }

        return validationIssues;
    }
}