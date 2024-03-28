import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname,'../', '.env')});

import DBFactory from "./database-factory"

const dbdialect = process.env.dbengine;
if (!dbdialect) {
    throw new Error(`Unknown database type ${dbdialect}`);
}
export const dataSource = DBFactory.new(dbdialect);
