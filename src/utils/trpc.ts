import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "monch-backend/src/service/router";

export const trpc = createReactQueryHooks<AppRouter>();
