import * as express from "express";
const router = express.Router();
import packageJson from '../../package.json';

const version_number = packageJson.version;

router.get('/version', (req, res, next) => {
    res.send({
        version: version_number,
    });
});

export default router;