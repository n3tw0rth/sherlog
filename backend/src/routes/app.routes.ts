import { Router } from "express";
import AppController from "../controllers/app.controller";

class AppRoutes {
  router = Router();
  controller = new AppController

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/ip", this.controller.ip);
  }
}

export default new AppRoutes().router;
