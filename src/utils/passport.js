import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import models from "../models";
import config from "../config";

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.KEY.JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        const user = await models.User.findOne({
          _id: jwtPayload._id
        });
        if (!user) {
          return done(new Error(), false);
        }
        return done(null, user);
      } catch (err) {
        return done(new Error(), false);
      }
    }
  )
);

module.exports = null;
