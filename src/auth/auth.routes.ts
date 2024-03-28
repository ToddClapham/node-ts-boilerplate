import * as express from "express";
const json = express.json();
const router = express.Router();

// controllers and middleware
import authCont from './cognitive-oauth.controller';

router.get('/oauth/redirect_url', authCont.getRedirectUrl);
router.post('/oauth/oauth2callback', json, authCont.oauth2Callback);

export default router;