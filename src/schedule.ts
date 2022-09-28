import Task from "./task";

type Crontab = Array<Task<unknown>>;

export default class Schedule {
  crontab: Crontab;

  constructor(crontab: Crontab) {
    this.crontab = crontab;
  }

  tick() {
    return Promise.all(this.crontab.map((task) => task.tick()));
  }

  run() {
    console.log("Starting schedule...");

    setInterval(() => this.tick(), 1000);
  }
}
