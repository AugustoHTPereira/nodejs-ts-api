import db from "../data/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";
import { Request, Response } from "express";

interface ISchedule {
  week_day: number;
  from: string;
  to: string;
}

interface IClassesBodyRequest {
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: number;
  schedule: ISchedule[];
}

export default class ClassesController {
  async Store(req: Request, res: Response) {
    const trx = await db.transaction();

    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    }: IClassesBodyRequest = req.body;

    try {
      const user_id = (
        await trx("users").insert({
          name,
          avatar,
          whatsapp,
          bio,
        })
      )[0];

      const class_id = (
        await trx("classes").insert({
          subject,
          cost,
          user_id,
        })
      )[0];

      const schedule_ids = await trx("class_schedule").insert(
        schedule.map((item) => ({
          week_day: item.week_day,
          from: convertHourToMinutes(item.from),
          to: convertHourToMinutes(item.to),
          class_id,
        }))
      );

      res.status(201).json({
        msg: "success",
        user_id,
        class_id,
        schedule_ids,
      });

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({ error: "Unexpected error" });
    }
  }

  async Get(req: Request, res: Response) {
    const filters = req.query;
    console.log(filters);

    if (!filters.week_day || !filters.subject || !filters.time)
      return res.status(400).json({
        error: "No filters",
      });

    const minutes = convertHourToMinutes(filters.time.toString());

    const data = await db("classes")
      .where("classes.subject", "=", filters.subject.toString())
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"])
      .whereExists(function () {
        this.select("class_schedule.*")
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [
            Number(filters.week_day),
          ])
          .whereRaw("`class_schedule`.`from` <= ??", [minutes])
          .whereRaw("`class_schedule`.`to` > ??", [minutes]);
      });

    res.json(data).status(200);
  }
}
