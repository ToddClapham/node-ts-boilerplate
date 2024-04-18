import { User } from "./User";
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
}