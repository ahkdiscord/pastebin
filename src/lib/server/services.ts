import { hoursToMilliseconds } from "date-fns"
import { deleteExpiredPastes } from "./db";

export class AutoExpire {
  start() {
    this.interval = setInterval(() => this.run(), hoursToMilliseconds(1));
  }

  stop() {
    clearInterval(this.interval);
  }

  private async run() {
    const number = await deleteExpiredPastes(new Date());

    console.log("Deleted", number, "expired posts.");
  }

  private interval?: NodeJS.Timeout;
}