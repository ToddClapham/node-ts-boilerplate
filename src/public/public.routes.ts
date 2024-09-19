import * as express from "express";
const router = express.Router();
import fs from 'fs';
import path from 'path';

const version_number = JSON.parse(fs.readFileSync(path.join(__dirname, '../../', 'package.json')).toString()).version;

router.get('/version', (req, res, next) => {
    res.send({
        version: version_number,
    });
});

export default router;