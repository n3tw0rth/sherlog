import { Application } from "express";
import appRoutes from "./app.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", appRoutes);
  }
}
