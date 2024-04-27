import { User } from "./user";
import { UserDTO } from "./userDTO";

export class UserDTOMapper {
    
    static fromModel(model: User): UserDTO {
        return {
            id: model.id,
            email: model.email,
            name: model.name,
            isAdmin: model.isAdmin,
        }
    }

    static toModel(dto: UserDTO): User {
        return new User(
            dto.id,
            dto.email,
            dto.name,
            dto.isAdmin,
        );
    }
}