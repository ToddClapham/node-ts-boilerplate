import jwt from 'jsonwebtoken';
import { UserEntity } from '../user/user.entity';

export class TokenService {

    constructor(
        private readonly privateKey: string
    ) {}

    async createToken(user: UserEntity): Promise<string> {
        return new Promise((resolve, reject) => {
            
            const payload: ITokenPayload = {
                subject: user.id.toString(),
            }
    
            jwt.sign(payload, this.privateKey, { expiresIn: '8h' }, (err, token) => {
                if (err) return reject(err);
                return resolve(token as string);
            });
        })
    }
    
    async verifyToken(token: string): Promise<ITokenPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.privateKey, (err, decoded: any) => {
                if (err) return reject(err);
                return resolve(decoded)
            });
        })
    }
}

interface ITokenPayload {
    subject: string
}