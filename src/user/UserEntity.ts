import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import ErrorMessage from "../util/ErrorMessage"
import { HttpCode } from "../util/HttpCodes"

@Entity({name: 'users'})
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    email: string

    @Column()
    name: string

    @Column()
    isAdmin: boolean

    static get notFoundError() {
        return new ErrorMessage(HttpCode.notFound, "User not found");
    }
}
