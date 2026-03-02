import z from "zod";

export const dateOfBirthSchema=z.coerce.date().max(new Date(), { message: "Date of birth cannot be in the future" })
  .min(new Date("1900-01-01"), {
    message: "Date of birth is too old",
  })