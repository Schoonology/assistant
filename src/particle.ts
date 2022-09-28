import Particle from "particle-api-js";
import Entity from "./entity";
import db from "./database";
import config from "./config";

const particle = new Particle();
const entity = new Entity(db, "particle");

export default class ParticleDevice {
  static access_token: string;

  static async init() {
    if (this.access_token) {
      return;
    }

    const token = await entity.get("access_token");
    if (token) {
      this.access_token = token;
      return;
    }

    if (!config.particle.username || !config.particle.password) {
      console.error(
        "No Particle credentials provided. Cannot talk to Particle."
      );
      return;
    }

    const loginResult = await particle.login(config.particle);

    this.access_token = loginResult.body.access_token;
  }

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async callFunction(name: string, argument = "") {
    await ParticleDevice.init();

    return particle.callFunction({
      deviceId: this.name,
      name,
      argument,
      auth: ParticleDevice.access_token,
    });
  }
}
