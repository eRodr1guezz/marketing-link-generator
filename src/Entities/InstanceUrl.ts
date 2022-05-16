export interface InstanceUrl {
  driverId: number;
  driver: string;
}

export class InstanceUrl extends URL implements InstanceUrl {
  constructor(url: string, driverId: number, driver: string) {
    super(url);
    this.driverId = driverId;
    this.driver = driver;
  }
}
