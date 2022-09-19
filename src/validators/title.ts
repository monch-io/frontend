import { z } from "zod";

/** Schema for validating the `title` of some entity. */
export const Title = z.string().trim().min(1);
