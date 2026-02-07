import { getAllPastesWithoutContent } from "$lib/server/db";

export async function load() {
  return {
    pastes: await getAllPastesWithoutContent(),
  };
}
