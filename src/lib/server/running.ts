import { CLOUDAHK_PASSWORD, CLOUDAHK_URL, CLOUDAHK_USERNAME } from "$env/static/private";
import type { Version } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { Duration } from "date-fns";

export interface Result {
  runtime?: Duration;
  output: string;
}

export async function runScript(script: string, version: Version): Promise<Result> {
  const cloudahkVersion = version === "v1.1" ? "ahk1" : version === "v2.0" ? "ahk2" : error(400, "version not supported by CloudAHK runner");

  const cloudahkUrl = new URL(`${cloudahkVersion}/run`, CLOUDAHK_URL);

  const response = await fetch(cloudahkUrl, {
    body: script,
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${CLOUDAHK_USERNAME}:${CLOUDAHK_PASSWORD}`)}`,
    },
  });

  const res: CloudAhkResponse = await response.json();

  return {
    runtime: res.time ? { seconds: res.time / 1000 } : undefined,
    output: res.stdout,
  }
}

interface CloudAhkResponse {
  time?: number;
  stdout: string;
}