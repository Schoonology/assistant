import potato from "./devices/potato";
import relayBrick from "./devices/relay_brick";
import Task from "./task";

const crontab: Array<Task<unknown>> = [
  new Task({
    name: "hello",
    cron: "* * * * *",
    fn: () => console.log("Hello!"),
  }),
];

class Schedule {
  tick() {
    console.log("Schedule.tick");

    return Promise.all(crontab.map((task) => task.tick()));
  }

  run() {
    console.log("Starting schedule...");

    setInterval(() => this.tick(), 1000);
  }
}

export default new Schedule();
