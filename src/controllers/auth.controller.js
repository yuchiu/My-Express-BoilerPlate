import bcrypt from "bcryptjs";

import models from "../models";
import { jwtSignUser } from "../utils";

const userSummary = user => {
  const summary = {
    username: user.username,
    email: user.email,
    timestamp: user.timestamp
  };
  return summary;
};

const authController = {
  create: async (req, res) => {
    try {
      const credentials = req.body;

      const isUsernameRegistered = await models.User.findOne({
        username: credentials.username
      });

      /* username already registered */
      if (isUsernameRegistered) {
        res.status(403).send({
          confirmation: false,
          error: `username: ${credentials.username} is already registered`
        });
      }

      const isEmailRegistered = await models.User.findOne({
        email: credentials.email
      });

      /* email already registered */
      if (isEmailRegistered) {
        res.status(403).send({
          confirmation: false,
          error: `email: ${credentials.email} is already registered`
        });
      }

      /* credential is validated */
      credentials.password = await bcrypt.hash(credentials.password, 10);
      const user = await models.User.create(credentials);
      res.status(200).send({
        user: userSummary(user),
        token: jwtSignUser(user)
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "server error"
      });
    }
  },
  login: async (req, res) => {
    try {
      const credentials = req.body;

      const user = await models.User.findOne({
        username: credentials.username
      });

      /* user not registered */
      if (!user) {
        return res.status(403).send({
          error: `this account ${credentials.username} is not yet registered`
        });
      }

      /* validate password */
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.toJSON().password
      );

      /* invalid password */
      if (!isPasswordValid) {
        res.status(403).send({
          error: "invalid password"
        });
      }

      /* password is validated */
      res.status(200).send({
        user: userSummary(user),
        token: jwtSignUser(user)
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "server error"
      });
    }
  },
  AutoLogin: async (req, res) => {
    try {
      // req.user is retreived from bearer token of auth.policy
      const { username } = req.user;
      const user = await models.User.findOne({
        username
      });

      res.status(200).send({
        confirmation: true,
        user: userSummary(user)
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "server error"
      });
    }
  }
};

export default authController;
