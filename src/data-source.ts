import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname,'../', '.env')});

import DBFactory from "./database-factory"
import { getEnvVariable } from './env';

const dbdialect = getEnvVariable('dbdialect');
export const dataSource = DBFactory.new(dbdialect);
