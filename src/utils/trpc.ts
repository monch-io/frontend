import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "monch-backend/build/service/router";

export const trpc = createReactQueryHooks<AppRouter>();
