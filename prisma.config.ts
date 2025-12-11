import "dotenv/config"; // ensures .env is loaded when Prisma runs
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // optional, but good to be explicit
  schema: "prisma/schema.prisma",

  datasource: {
    // TS-safe: env() returns string, not string | undefined
    url: env("DATABASE_URL"),
  },
});
