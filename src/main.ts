import Particle from "particle-api-js";
import Wemo from "wemo-client";
import Database from "better-sqlite3";
import Entity from "./entity";

const { PARTICLE_USERNAME, PARTICLE_PASSWORD } = process.env;

async function toggleRelayBrick(state: boolean) {
  const particle = new Particle();

  const {
    body: { access_token },
  } = await particle.login({
    username: PARTICLE_USERNAME,
    password: PARTICLE_PASSWORD,
  });

  const result = await particle.callFunction({
    deviceId: "RelayBrick",
    name: state ? "enable_a" : "disable_a",
    argument: "",
    auth: access_token,
  });

  console.log("%j", result);
}

async function toggleWemo(state: boolean) {
  const wemo = new Wemo();

  wemo.discover(function (err, deviceInfo) {
    console.log("Wemo Device Found: %j", deviceInfo);

    const client = wemo.client(deviceInfo);

    client.on("error", function (err) {
      console.log("Error: %s", err.code);
    });

    client.on("binaryState", function (value) {
      console.log("Binary State changed to: %s", value);
    });

    client.setBinaryState(state ? 1 : 0);
  });
}

async function setupDb() {
  const db = new Database(":memory:");
  const entity = new Entity(db, "a");

  console.log("Initial:", await entity.get("b"));
  console.log("Write:", await entity.set("b", 42));
  console.log("Post write: %j", await entity.get("b"));

  db.close();
}

// toggleRelayBrick(true);
// toggleWemo(false);
setupDb();
