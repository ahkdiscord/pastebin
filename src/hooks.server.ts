import { init } from "$lib/server/db";
import { AutoExpire } from "$lib/server/services";

await init();

const autoExpire = new AutoExpire();

autoExpire.start();