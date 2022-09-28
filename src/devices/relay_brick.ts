import ParticleDevice from "../particle";

class RelayBrick extends ParticleDevice {
  constructor() {
    super("RelayBrick");
  }

  enable(slot: string) {
    return this.callFunction(`enable_${slot}`);
  }

  disable(slot: string) {
    return this.callFunction(`disable_${slot}`);
  }
}

export default new RelayBrick();
