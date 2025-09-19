import { Request, Response } from "express";

export default class AppController {
  async ip(req: Request, res: Response) {
    try {
      res.status(200).json({
        message: req.headers["x-forwarded-for"] || req.socket.remoteAddress
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error!"
      });
    }
  }
}
