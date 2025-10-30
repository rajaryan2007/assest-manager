import { betterAuth } from "better-auth";

const adminRole = "admin";
const userRole = "user";

export const auth = betterAuth({
  database: drizzleAdapter(db),
});
