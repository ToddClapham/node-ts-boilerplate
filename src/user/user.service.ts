import { Repository } from "typeorm";
import ErrorMessage from "../util/ErrorMessage";
import { HttpCode } from "../util/HttpCodes";
import { User } from "./User";
import { UserMapper } from "./UserMapper";
import { UserValidation } from "./UserValidation";
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

        return UserMapper.fromEntity(userEntity);
    }

    async getUsers(): Promise<User[]> {
        const userEntities = await this.userRepo.find();
        return userEntities.map(x => UserMapper.fromEntity(x));        
    }

    async getUserById(userId: number): Promise<User> {
        const userEntity = await this.userRepo.findOne({
            where: {id: userId}
        });
        if (!userEntity) throw new ErrorMessage(HttpCode.badRequest, "User not found");

        return UserMapper.fromEntity(userEntity);
    }

    async getUserByEmail(userEmail: string): Promise<User> {
        const userEntity = await this.userRepo.findOne({
            where: {email: userEmail}
        });
        if (!userEntity) throw new ErrorMessage(HttpCode.badRequest, "User not found");

        return UserMapper.fromEntity(userEntity);
    }

    async updateUser(user: User, userUpdate: any): Promise<User> {
        let userEntity = UserMapper.toEntity(user);

        userEntity = this.userRepo.merge(userEntity, userUpdate);
        const updatedUser = await this.userRepo.save(userEntity);
        
        return UserMapper.fromEntity(updatedUser);
    }

    async deleteUser(user: User) {
        await this.userRepo.delete({id: user.id});
    }
}