import Wemo, { type WemoClient } from "wemo-client";

export class WemoDevice {
  name: string;
  client?: WemoClient;
  _pClient: Promise<WemoClient>;
  wemo: Wemo;

  constructor(name: string) {
    this.name = name;
    this.wemo = new Wemo();

    this._pClient = new Promise((resolve, reject) => {
      this.wemo.discover((err, deviceInfo) => {
        if (deviceInfo.friendlyName === this.name) {
          this.client = this.wemo.client(deviceInfo);
          resolve(this.client);
        }
      });
    });
  }
}

export class WemoSwitch extends WemoDevice {
  state?: boolean;

  constructor(name: string) {
    super(name);

    this._pClient.then((client) => {
      client.on("binaryState", (value) => {
        this.state = !!value;
      });

      if (this.state != null) {
        this.toggle(this.state);
      }
    });
  }

  async toggle(state: boolean) {
    if (!this.client) {
      console.debug(
        `Tried to set state of ${this.name} to ${state} before it was discovered.`
      );

      this.state = state;

      return null;
    }

    this.state = state;

    return new Promise((resolve, reject) =>
      this.client?.setBinaryState(this.state ? 1 : 0, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.state);
        }
      })
    );
  }
}
