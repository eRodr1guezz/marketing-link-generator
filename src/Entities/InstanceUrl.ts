export class InstanceUrl extends URL {
  constructor(
    url: string, 
    readonly driverId: number, 
    public driver: string
  ) {
    super(url);
    this.driverId = driverId;
    this.driver = driver;
  }

  get id(): number {
    return this.driverId
  }

}
