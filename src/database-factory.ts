import "reflect-metadata";
import { DataSource } from "typeorm"
import path = require("path");
import { UserEntity } from "./user/user.entity";
import { getEnvVariable } from "./env";

const isProduction = getEnvVariable('NODE_ENV') === 'production';

const username = getEnvVariable('dbusername');
const password = getEnvVariable('dbpassword');
const name = getEnvVariable('dbname');

const entities = [
    UserEntity,
]

class DBFactory {

    public static new(engine: string) : DataSource {
    
        switch (engine) {
            case "sqlite":
                return new DataSource({
                    type: "sqlite",
                    database: path.join(__dirname, '../', sqliteDBName()),
                    synchronize: true,
                    logging: false,
                    entities: entities,
                    migrations: [],
                    subscribers: [],
                })
                
            case "mssql":
                return new DataSource({
                    type: "mssql",
                    host: "localhost",
                    port: 1433,
                    username: username,
                    password: password,
                    database: name,
                    synchronize: true,
                    logging: false,
                    entities: entities,
                    migrations: [],
                    subscribers: [],
                })
        
            default:
                throw new Error(`Unknown database type ${engine}`);
        }
    }
}

function sqliteDBName() {
    if (isProduction) return 'database.sqlite';
    return 'database.dev.sqlite';
}

export default DBFactory