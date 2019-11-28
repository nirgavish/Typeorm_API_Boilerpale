import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import * as HttpStatus from 'http-status-codes';

import config from '../config';
import { Repo } from '../services/repo.service';
import { User } from '../entities/User';

const { errors } = config;
const signupRouter: Router = Router();

// on routes that end in /signup
// -----------------------------
signupRouter.route('/')

  .post(
    [
      body('name').isLength({ min: 1 }),
      body('email').isEmail(),
      body('password').isLength({ min: 6 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {

      const validationErrors = validationResult(req);

      if (validationErrors.isEmpty()) {
        try {
          const user = await Repo(User).insert(req.body);
          res.status(HttpStatus.OK).json({
            success: true,
            data: user
          });
        } catch (err) { // DB exception or some other exception while inserting user
          res.status(HttpStatus.BAD_REQUEST).json({
            error: err
          });
        }
      } else {  // validaiton error
        res.status(HttpStatus.BAD_REQUEST).json({
          error: validationErrors.array()
        });
      }

    });

export default signupRouter;
