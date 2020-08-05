import { Request, Response } from "express";
import db from "../data/connection";

export default class ConnectionsController {
  async Store(req: Request, res: Response) {
    const { user_id } = req.body;
    await db("connections").insert({ user_id });

    return res.status(201).send();
  }

  async Get(req: Request, res: Response) {
    return res
      .status(200)
      .send((await db("connections").count("id as count_connections"))[0]);
  }
}
