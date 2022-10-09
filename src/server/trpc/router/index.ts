// src/server/router/index.ts
import { t } from "../trpc";
import { urlRouter } from "./url";

export const appRouter = t.router({
  url: urlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
