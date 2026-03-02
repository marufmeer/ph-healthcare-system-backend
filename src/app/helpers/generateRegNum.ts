import { v4 as uuidv4 } from "uuid";

export const generateUUIDRegistration = (prefix: string) => {
  return `${prefix}-${uuidv4()}`;
};