import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';

import { Strategy } from 'passport';
import config from '../../src/config';

import { Repo } from '../../src/services/repo.service';
import { User } from '../../src/entities/User';

const { auth } = config;

export class AuthHandler {

  jwtOptions: StrategyOptions;
  superSecret = auth.secretKey;

  constructor() {
    this.jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.superSecret
    };
  }

  /**
   * initialize the Auth middleware & configure JWT strategy for Passport
   */
  initialize() {
    passport.use('jwt', this.getStrategy());
    return passport.initialize();
  }

  /**
   * configure & return the JWT strategy for passport
   */
  getStrategy(): Strategy {
    return new JWTStrategy(this.jwtOptions, async (jwt_payload, next) => {

      try {
        const user = await Repo(User).findOne({email: jwt_payload.email});

        if (!user) {
          return next(null, false);
        }

        return next(undefined, {
          id: user.id,
          email: user.email
        });

      } catch (err) {
        return next(null, false);
      }
    });
  }

  /**
   * Authentication handler. Call this on routes needs authentication
   */
  authenticate() {
    return passport.authenticate('jwt', { session: false, failWithError: true });
  }

  /**
   * Generate JWT token.
   * @param user
   */
  generateToken(user: User): string {
    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, this.superSecret, {
        expiresIn: '5d',
      });

    return token;

  }
}
