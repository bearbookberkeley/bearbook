/**
 * package.json override for oauth is to resolve package dependency issues in passport-google-oauth20 and
 * passport-aouth2. Once these packages are updated, this override can be removed.
 *
 * Opened pull request: https://github.com/jaredhanson/passport-oauth2/pull/165
 */

import type { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../schemas/userSchema';
import { config } from './config';

// routes need to be added as authorized origins/redirect uris in google cloud console
const LOGIN_ROUTE = '/login';
const CALLBACK_ROUTE = '/login/callback';
const LOGOUT_ROUTE = '/logout';

const SUCCESS_REDIRECT = '/success';
const FAILURE_REDIRECT = '/fail';

const SCOPE = ['profile', 'email'];

export default async (app: Application) => {
  // init
  app.use(session({
    secret: config.SESSION_SECRET,
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: !config.isDev,
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
    rolling: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // routes
  app.get(LOGIN_ROUTE, (req, res, next) => {
    // check if user is already logged in
    if (req.isAuthenticated()) {
      res.redirect(SUCCESS_REDIRECT);
    } else {
      next();
    }
  }, passport.authenticate('google', {
    hd: 'berkeley.edu',
    scope: SCOPE,
    accessType: 'offline',
    prompt: 'consent',
  }));
  app.get(CALLBACK_ROUTE, passport.authenticate('google', {
    failureRedirect: FAILURE_REDIRECT,
    // failureMessage: "failed",
    successRedirect: SUCCESS_REDIRECT,
  }));
  app.post(LOGOUT_ROUTE, (req, res) => {
    req.logout((err) => {
      if (err) {
        res.redirect(FAILURE_REDIRECT);
      } else {
        res.redirect(SUCCESS_REDIRECT);
      }
    });
  });

  // config
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
  passport.use(new GoogleStrategy.Strategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_ROUTE,
    scope: SCOPE,
    state: true,
  }, async (_, __, profile, done) => {
    // _ -> accessToken, __ -> refreshToken
    // not used! do not expose for security reasons.

    if (profile._json.hd !== 'berkeley.edu') {
      return done(null, false, { message: 'Not a Cal student' });
    }

    const email = profile.emails?.[0].value;

    // null check for type safety
    if (!email) {
      return done(null, false, { message: 'No email found' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await new User({
        username: profile.displayName,
        firstName: profile.name?.givenName || '',
        lastNameInitial: profile.name?.familyName[0] || '',
        email,
      });
    }

    user.save();

    done(null, user);
  }));
};
