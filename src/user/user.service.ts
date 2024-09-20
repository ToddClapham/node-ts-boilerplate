import { Repository } from "typeorm";
import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";
import { User } from "./user";
import { UserValidation } from "./userValidation";
import { NewUserDTO } from "./newUserDTO";
import { UserEntity } from "./user.entity";

export class UserService {

    private readonly userValidator: UserValidation

    constructor(
        private readonly userRepo: Repository<UserEntity>,
    ) {
        this.userValidator = new UserValidation(this.userRepo);
    }

    async createUser(newUser: NewUserDTO): Promise<User> {

        const validationIssues = await this.userValidator.validateNew(newUser);
        if (validationIssues.length > 0) {
            throw new ErrorMessage(HttpCode.badRequest, validationIssues.join(". \r\n"));
        }

        const userEntity = this.userRepo.create({
            email: newUser.email,
            name: newUser.name,
            isAdmin: newUser.isAdmin,
        });

        await this.userRepo.save(userEntity);

        return User.fromEntity(userEntity);
    }

    async getUsers(): Promise<User[]> {
        const userEntities = await this.userRepo.find();
        return userEntities.map(x => User.fromEntity(x));        
    }

    async getUserById(userId: number): Promise<User> {
        const userEntity = await this.userRepo.findOne({
            where: {id: userId}
        });
        if (!userEntity) throw new ErrorMessage(HttpCode.badRequest, "User not found");

        return User.fromEntity(userEntity);
    }

    async getUserByEmail(userEmail: string): Promise<User> {
        const userEntity = await this.userRepo.findOne({
            where: {email: userEmail}
        });
        if (!userEntity) throw new ErrorMessage(HttpCode.badRequest, "User not found");

        return User.fromEntity(userEntity);
    }

    async updateUser(user: User, userUpdate: User): Promise<User> {
        const userEntity = User.toEntity(user);
        const userUpdateEntity = User.toEntity(userUpdate);

        const mergedUserEntity = this.userRepo.merge(userEntity, userUpdateEntity);
        const updatedUser = await this.userRepo.save(mergedUserEntity);
        
        return User.fromEntity(updatedUser);
    }

    async deleteUser(user: User) {
        const userEntity = User.toEntity(user);
        await this.userRepo.remove(userEntity);
    }
}