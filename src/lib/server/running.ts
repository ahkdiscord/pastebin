import { CLOUDAHK_PASSWORD, CLOUDAHK_URL, CLOUDAHK_USERNAME } from "$env/static/private";
import type { Language } from "$lib/Language";
import { error } from "@sveltejs/kit";
import type { Duration } from "date-fns";

export interface Result {
  runtime?: Duration;
  output: string;
}

export async function runScript(script: string, language: Language): Promise<Result> {
  const cloudahkLanguage = getCloudahkLanguage(language) ?? error(400, "language not supported by CloudAHK runner");

  const cloudahkUrl = new URL(`${cloudahkLanguage}/run`, CLOUDAHK_URL);

  const response = await fetch(cloudahkUrl, {
    body: script,
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLOUDAHK_USERNAME}:${CLOUDAHK_PASSWORD}`).toString("base64")}`,
    },
  });

  const res: CloudAhkResponse = await response.json();

  return {
    runtime: res.time ? { seconds: res.time / 1000 } : undefined,
    output: res.stdout,
  };
}

interface CloudAhkResponse {
  time?: number;
  stdout: string;
}

function getCloudahkLanguage(language: Language): string | undefined {
  switch (language) {
    case "ahkv1.1":
      return "ahk1";

    case "ahkv2.0":
      return "ahk2";
  }
}
