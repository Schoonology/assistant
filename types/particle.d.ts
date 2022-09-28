declare module "particle-api-js" {
  type Account = {
    body: {
      access_token: string;
    };
  };

  type Device = {
    id: string;
    name: string;
    online: boolean;
    connected: boolean;
    functions: Array<string>;
    variables: Record<string, string>;
    status: string;
  };

  type Devices = {
    body: Array<Device>;
  };

  export default class Particle {
    login({ username: string, password: string }): Promise<Account>;

    listDevices({ auth: string }): Promise<Devices>;

    callFunction({
      deviceId: string,
      name: string,
      argument: string,
      auth: string,
    }): Promise<Devices>;
  }
}
