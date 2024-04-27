import DBFactory from "./database-factory"
import { getEnvVariable } from './env';

const dbengine = getEnvVariable('dbengine');
export const dataSource = DBFactory.new(dbengine);
