import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { body, validationResult } from 'express-validator/check';
import { AuthHandler } from '../../_framework/middleware/authHandler';
import { Repo } from '../services/repo.service';
import { User } from '../entities/User';

const loginRouter: Router = Router();

// on routes that end in /login
// ------------------------------
loginRouter.route('/')
  .post(
    [
      body('email').isEmail(),
      body('password').isLength({ min: 1 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {

      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) { // no error

        const email = req.body.email;
        const password = req.body.password;

        const user = await Repo(User).internalRepo.createQueryBuilder('user').addSelect('user.password').where({email}).getOne();

        if (!user) {
          res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Email not found'
          });
        } else {
          const isPasswordCorrect = await bcrypt.compare(password, user.password);

          if (isPasswordCorrect) {
            const authHandler = new AuthHandler();
            const token = authHandler.generateToken(user);
            res.status(HttpStatus.OK).json({
              data: token
            });
          } else {
            res.status(HttpStatus.UNAUTHORIZED).json({
              message: 'Incorrect password'
            });
          }

        }

      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          errorsArray: validationErrors.array()
        });
      }

    });

export default loginRouter;
