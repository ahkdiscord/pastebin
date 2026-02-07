import { init } from "$lib/server/db";
import { AutoExpirePastes, AutoExpireSessions } from "$lib/server/services";

await init();

const autoExpirePastes = new AutoExpirePastes();
autoExpirePastes.start();

const autoExpireSessions = new AutoExpireSessions();
autoExpireSessions.start();
