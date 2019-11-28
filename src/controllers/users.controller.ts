import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import config from '../config';
import { body, validationResult } from 'express-validator/check';
import { Repo } from '../services/repo.service';
import { User } from '../entities/User';

import { List, GetById, Put, Post, Delete } from '../../_framework/utils/canned-response.util';

const { errors } = config;
const usersRouter: Router = Router();

// on routes that end in /users
// -----------------------------
usersRouter.route('/')
  .get(async (req: Request, res: Response) => {
    await List(req, res, User, {});
  })
/*
  .post(async (req: Request, res: Response) => {
    await Post(req, res, User, {});
  })
  .post(async (req: Request, res: Response) => {
    await Post(req, res, User, {});
  })
  ;

  usersRouter.route('/:id')
  .get(async (req: Request, res: Response) => {
    await GetById(req, res, User, {});
  })
  .put(async (req: Request, res: Response) => {
    await Put(req, res, User, {});
  })
  .delete(async (req: Request, res: Response) => {
    await Delete(req, res, User, {});
  })
  ;
*/

// on routes that end in /users/profile
// --------------------------------------
usersRouter.route('/profile')

  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await Repo(User).findById(req.user.id);

      // if user not found
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: `${errors.entityNotFound}: user id`
        });
        return;
      }
      // return found user
      res.status(HttpStatus.OK).json( { data: user } );

    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        errorObj: err
      });
    }
  })

  .put(
    [
      body('name').optional().isLength({ min: 1 }),
      body('email').optional().isEmail(),
      body('oldPassword').optional().isLength({ min: 6 }),
      body('newPassword').optional().isLength({ min: 6 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        try {
          const user = await Repo(User).findById(req.user.id);
          // if user not found
          if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
              message: `${errors.entityNotFound}: user id`
            });
          }

          // if user sent old & new password in body
          if (req.body.oldPassword && req.body.newPassword) {
            // Validate old password and return error if it's not correct
            const isOldPasswordCorrect = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!isOldPasswordCorrect) {
              res.status(HttpStatus.BAD_REQUEST).json({
                message: errors.incorrectOldPassword
              });
            }
          } else if ((req.body.oldPassword && !req.body.newPassword) ||
            (!req.body.oldPassword && req.body.newPassword)) {
            // if user sends only one of old or new password in body
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: `${errors.oldAndNewPasswordBothInBody}`
            });
          }

          // now update the user attributes according to req body
          if (req.body.name) user.name = req.body.name;
          if (req.body.email) user.email = req.body.email;
          if (req.body.newPassword) await user.setPassword(req.body.newPassword);

          const updatedUser = await Repo(user).update(user);
          res.status(HttpStatus.OK).json({
            user: updatedUser
          });
        } catch (err) {
          // db errors e.g. unique constraints etc
          res.status( HttpStatus.BAD_REQUEST ).json({
            errorObj: err
          });
        }
      } else {  // validation errors
        res.status(HttpStatus.BAD_REQUEST).json({
          errorsArray: validationErrors.array()
        });
      }
    });

// on routes that end in /users/:id
// --------------------------------------
// Note: This route is dynamic and goes at end because we don't want /profile to match this route (e.g. 'profile' considered as valid id). Order matters in expressjs.
usersRouter.route('/:id')

  .get(async (req: Request, res: Response, next: NextFunction) => {

    try {
      const user = await Repo(User).findById(req.params.id);

      // if user not found
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: `${errors.entityNotFound}: user id`
        });
        return;
      }
      // return found user
      res.status(HttpStatus.OK).json({
        user: user
      });

    } catch (err) { // db exception. example: wrong syntax of id e.g. special character
      res.status(HttpStatus.BAD_REQUEST).json({
        errorObj: err
      });
    }

  });

export default usersRouter;
