import Particle from "particle-api-js";
import Wemo from "wemo-client";
import Database from "better-sqlite3";

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

  const createStatement = db.prepare(
    "CREATE TABLE IF NOT EXISTS data (entity text, key text, value text)"
  );
  const createResult = await createStatement.run();

  console.log("Setup:", createResult);

  const initialGetStatement = db.prepare(
    "SELECT value FROM data WHERE entity = 'a' AND key = 'b'"
  );
  const initialGetResult = await initialGetStatement.get();

  console.log("Initial:", initialGetResult);

  const writeStatement = db.prepare(
    "INSERT INTO data (entity, key, value) VALUES ('a', 'b', ?)"
  );
  const writeResult = await writeStatement.run(["42"]);

  console.log("Write:", writeResult);

  const postWriteStatement = db.prepare(
    "SELECT value FROM data WHERE entity = 'a' AND key = 'b'"
  );
  const postWriteResult = await postWriteStatement.get();

  console.log("Post write:", postWriteResult);

  db.close();
}

// toggleRelayBrick(true);
// toggleWemo(false);
setupDb();
