import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";

import config from "./config";
import router from "./router";
import "./utils/passport";

const app = express();

/* allow cors & dev logs for development environment */
if (process.env.NODE_ENV === "development") {
  app.use(cors());
  app.use(logger("dev"));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());

router(app);

/* listen to port */
app.listen(config.PORT || 3030, () => {
  if (config.PORT) {
    console.log(`app listenning on port ${config.PORT}`);
  } else {
    console.log("app listenning on port 3030");
  }
});

/* database connection */
mongoose.connect(
  config.MONGO_DB.MONGO_LOCAL_URI || config.MONGO_DB.MONGO_CLOUD_URI,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log(`DB Connection failed:${err}`);
    } else {
      console.log("DB Connection Success");
    }
  }
);
