import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { format } from "date-fns";

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson()],
  define: {
    __BUILD_INFO__: {
      version: format(new Date(), "yyyy.DDD.kkmm", { useAdditionalDayOfYearTokens: true }),
    },
  },
});
