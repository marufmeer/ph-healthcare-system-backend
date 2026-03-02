import z from "zod";

export const GenderSchema = z.enum(["MALE", "FEMALE", "OTHER"])
export const MaritalStatusEnum = z.enum([
  "MARRIED",
  "UNMARRIED"
]);

export const bloodGroupSchema = z.enum([
  "A_POSITIVE",
  "B_POSITIVE",
  "O_POSITIVE",
  "AB_POSITIVE",
  "A_NEGATIVE",
  "B_NEGATIVE",
  "O_NEGATIVE",
  "AB_NEGATIVE"
]);