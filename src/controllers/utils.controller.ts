import { Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';

import { User } from '../entities/User';
import { AuthHandler } from '../../_framework/middleware/authHandler';
import { Repo } from '../services/repo.service';

const auth = new AuthHandler();
const utilsRouter: Router = Router();

// todo: shouldn't go in production or it needs to be protected with some password/key in body etc
utilsRouter.get(
  '/first_account',
  async (req: Request, res: Response) => {
    try {
      res.status(HttpStatus.OK).json(
        await Repo(User).insert({
          name: 'Testy Testinzon',
          email: 'test@gmail.notcom',
          password: '1234'
        })
      );
    } catch (e) {
      res.status(HttpStatus.CONFLICT).json({
        message: 'User already exists.'
      });
    }
  }
);

utilsRouter.get(
  '/me',
  auth.authenticate(),
  async (req: Request, res: Response) => {
    try {
      const user = await Repo('user').findOne({email: req.user.email});
      if (user) {
        return res.status(HttpStatus.OK).json({
          data: user
        });
      }
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Authentication error. Unable to find user!'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message
      });
    }
  }
);

export default utilsRouter;
