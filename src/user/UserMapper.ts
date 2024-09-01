import { dataSource } from "../data-source";
import { UserEntity } from "./user.entity";
import { User } from "./user";

const userRepo = dataSource.getRepository(UserEntity);

export class UserMapper {
    static fromEntity(entity: UserEntity): User {
        return new User(
            entity.id, 
            entity.email, 
            entity.name, 
            entity.isAdmin,
        );
    }

    static toEntity(user: User): UserEntity {
        const entity = userRepo.create({
            id: user.id,
            email: user.email.toLowerCase(),
            name: user.name,
            isAdmin: user.isAdmin,
        })
        return entity;
    }
}