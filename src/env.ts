import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, '../', '.env')});

export function getEnvVariable(name: string): string {
    const variable = process.env[name];
    if (variable === undefined || variable === null) {
        throw new Error(`The env variable "${name}" must be provided`);
    }
    return variable;
}