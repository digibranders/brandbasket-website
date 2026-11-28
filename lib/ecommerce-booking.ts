import { z } from "zod";

export const ECOMMERCE_BOOKING_API = "/api/ecommerce-campaign/booking";

const date = z.iso.date();
const time = z.iso.datetime({ offset: true });

export const bookingTimeZone = z.string().min(1).max(64).refine((zone) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
});

export const availability = z.object({
  days: z.array(z.object({ date, times: z.array(time) })),
});

export const bookingConfirmation = z.object({
  start: time,
  status: z.enum(["accepted", "pending"]),
});
