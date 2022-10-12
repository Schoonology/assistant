import Schedule from "./schedule";
import Task from "./task";

import potato from "./devices/potato";
import relayBrick from "./devices/relay_brick";

// To double check cron syntax, look at https://cron.help
const schedule = new Schedule([
  new Task({
    name: "Start dehumidifier",
    cron: "0 8 * * *",
    run() {
      console.log("Starting dehumidifier...");
      relayBrick.enable("d");
    },
  }),
  new Task({
    name: "Stop dehumidifier",
    cron: "0 20 * * *",
    run() {
      console.log("Stopping dehumidifier...");
      relayBrick.disable("d");
    },
  }),
  new Task({
    name: "Turn on reading light",
    cron: "0 19 * * *",
    run() {
      console.log("Turning on reading light...");
      relayBrick.enable("c");
    },
  }),
  new Task({
    name: "Turn off reading light",
    cron: "0 21 * * *",
    run() {
      console.log("Turning off reading light...");
      relayBrick.disable("c");
    },
  }),
]);

schedule.run();
