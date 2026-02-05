import type { Language } from "$lib/Language";
import type { Result } from "$lib/server/running";

export function isRunnable(language: Language): boolean {
  switch (language) {
    case "ahkv1.1":
    case "ahkv2.0":
      return true;
  }

  return false;
}

export async function runScript(script: string, language: Language): Promise<string> {
  const response = await fetch("/run", {
    method: "POST",
    body: JSON.stringify({ language, script }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw Error(await response.text());

  const result: Result = await response.json();

  return result.output;
}
