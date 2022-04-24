import express, { Express, json } from "express";
import { promisifyHandler } from "./promisifyHandler";

export const buildApp = async (): Promise<Express> => {
  const app = express();

  app.use(json());

  app.post(
    "/api/v1/hello",
    promisifyHandler(async (req, res) => {
      res.status(200).json({
        message: "hello!",
      });
    })
  );

  return app;
};
