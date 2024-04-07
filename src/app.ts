// DEVELOPMENT SETTING
const corsAddress = 'http://localhost:4200';

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname,'../', '.env')});

import cors from 'cors';

import express, { Request, Response, NextFunction } from 'express';

import publicRoutes from './public/public.routes';
import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';

import { dataSource } from './data-source';
import tokenMid from './auth/token.middleware';
import authMid from './auth/auth.middleware';
import { getEnvVariable } from './env';

dataSource.initialize().then(async () => {

    const app = express();
    
    const port = getEnvVariable('port');
    
    const isProduction = getEnvVariable('NODE_ENV') === 'production';
    console.log('Production mode:', isProduction);
    
    // Cross Origin Resource Sharing - for secuity around the origin of requests
    app.use(cors({
        credentials: true, 
        origin: corsAddress,
    }))
    
    app.use('/', publicRoutes);
    app.use('/', authRoutes);

    // Any requests to the api must be authenticated, different types of auth such as APIKeyAuth could exist here too
    const authenticationTypes = [tokenMid.authenticate];
    app.use('/api/v1', authenticationTypes, authMid.isAuthenticated);
    app.use('/api/v1', userRoutes);

    // host images
    app.use('/images', express.static(path.join(__dirname, '../', 'public')));

    // serve the angular app
    app.use('/', express.static(path.join(__dirname, '../', 'dist')));
    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '../', 'dist', 'index.html'));
    });
    
    // error handler
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
        if (error.customErrorMessage) {
            res.status(error.httpStatus).send({message: error.message});
        } else {
            console.log('Server error', error);
            res.status(500).send({message: "Server error"});
        }
    });

    app.use('*', (req: Request, res: Response, next: NextFunction) => {
        res.status(404).send({error: 'Route not found'});
    });

    const server = app.listen(port, () => {
        console.log("Server running on port", port);
    });

    // Helps the app shut down gracefully when deployed on Unix-like systems
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received');

        console.log('Stopping Nodejs server');
        server.close(() => {
            process.exit(0);
        })
    });
})