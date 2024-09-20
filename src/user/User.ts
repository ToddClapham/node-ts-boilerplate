import { dataSource } from "../data-source";
import { UserEntity } from "./user.entity";
import { UserDTO } from "./userDTO";

const userRepo = dataSource.getRepository(UserEntity);

export class User {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public isAdmin: boolean,
    ) {}

    static toDTO(model: User): UserDTO {
        return {
            id: model.id,
            email: model.email,
            name: model.name,
            isAdmin: model.isAdmin,
        }
    }

    static fromDTO(dto: UserDTO): User {
        return new User(
            dto.id,
            dto.email,
            dto.name,
            dto.isAdmin,
        );
    }

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