import DBFactory from "./database-factory"
import { getEnvVariable } from './env';

const dbdialect = getEnvVariable('dbdialect');
export const dataSource = DBFactory.new(dbdialect);
