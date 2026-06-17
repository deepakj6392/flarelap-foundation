import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load environment variables from .env.local
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
