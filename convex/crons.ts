import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// An alternative way to create the same schedule as above with cron syntax
crons.cron(
  "payment reminder duplicate",
  "0 16 1 * *",
  internal.payments.sendPaymentEmail,
  { email: "my_email@gmail.com" } // argument to sendPaymentEmail
);
