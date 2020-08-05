import express, { response } from "express";
import ClassesController from "./controllers/classesController";
import ConnectionsController from "./controllers/connectionsController";

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.post("/classes", classesController.Store);
routes.get("/classes", classesController.Get);

routes.post("/connections", connectionsController.Store);
routes.get("/connections", connectionsController.Get);


export default routes;
