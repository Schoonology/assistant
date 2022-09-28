import cron from "cron-parser";
import Entity from "./entity";
import db from "./database";

type TaskFn<T> = () => T | Promise<T>;

export default class Task<T> {
  entity: Entity;
  cron: string;
  name: string;
  fn: TaskFn<T>;

  constructor({
    name,
    cron,
    run: fn,
  }: {
    name: string;
    cron: string;
    run: TaskFn<T>;
  }) {
    this.name = name;
    this.cron = cron;
    this.fn = fn;

    this.entity = new Entity(db, `task:${name}`);
  }

  async calculateNextRunDate(): Promise<Date> {
    const lastRunAt = await this.entity.get("last_run_at");

    return cron
      .parseExpression(this.cron, {
        currentDate: new Date(lastRunAt ?? 0),
      })
      .next()
      .toDate();
  }

  async updateRunDate(date: Date = new Date()): Promise<Date> {
    await this.entity.set("last_run_at", date.valueOf());

    return date;
  }

  async tick() {
    const now = new Date();
    const nextRunDate = await this.calculateNextRunDate();

    if (nextRunDate < now) {
      await this.fn();
      await this.updateRunDate();
    }
  }
}
