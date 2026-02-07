import { hoursToMilliseconds } from "date-fns";
import { deleteExpiredPastes, deleteExpiredSessions } from "./db";

export class AutoExpirePastes {
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

export class AutoExpireSessions {
  start() {
    this.interval = setInterval(() => this.run(), hoursToMilliseconds(1));
  }

  stop() {
    clearInterval(this.interval);
  }

  private async run() {
    const number = await deleteExpiredSessions(new Date());

    console.log("Deleted", number, "expired sessions.");
  }

  private interval?: NodeJS.Timeout;
}
