declare module "wemo-client" {
  type DiscoverCallback = (never, DeviceInfo) => void;
  type WemoClientEvent = "error" | "binaryState";

  class WemoClient {
    on(event: "error", listener: (never) => void);
    on(event: "binaryState", listener: (state: int) => void);

    setBinaryState(int);
  }

  export default class Wemo {
    client(DeviceInfo): WemoClient;

    discover(cb: DiscoverCallback);
  }
}
