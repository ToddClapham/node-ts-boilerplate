import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name: 'users'})
export class UserEntity {

    @PrimaryGeneratedColumn()
    id!: number
    
    @Column()
    email!: string

    @Column()
    name!: string

    @Column()
    isAdmin!: boolean
}
