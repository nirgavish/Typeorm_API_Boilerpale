import { Router } from 'express';
import { AuthHandler } from './middleware/authHandler';
import config from '../src/config';

import modules from '../_artifacts/controllers.artifact';

const auth: AuthHandler = new AuthHandler();
const router: Router = Router();

const explicitlyUnprotected: string[] = config.explicitlyUnprotected;

Object.keys(modules).forEach((moduleName: string) => {
    if ( explicitlyUnprotected.indexOf(moduleName) > -1 ) {
        router.use(`/${moduleName}`, modules[moduleName]);
    } else {
        router.use(`/${moduleName}`, auth.authenticate(), modules[moduleName]);
    }
});

export default router;
