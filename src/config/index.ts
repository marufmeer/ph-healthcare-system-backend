// env.ts
import dotenv from "dotenv";

dotenv.config();

/* ================= ENV TYPES ================= */
interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  BCRYPT_SALT_ROUND: string;
  DATABASE_URL: string;

  JWT: {
    JWT_SECRET_ACCESS_TOKEN: string;
    JWT_SECRET_REFRESH_TOKEN: string;
    JWT_ACCESS_TOKEN_EXPIRES: string;
    JWT_REFRESH_TOKEN_EXPIRES: string;
    JWT_RESET_PASSWORD_EXPIRES:string
  };

  GOOGLE: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
  };

  FRONTEND_URL: string;

  SMTP: {
    HOST: string;
    PORT: number;
    USER: string;
    PASS: string;
    FROM: string;
  };

  REDIS: {
    USERNAME: string;
    PASSWORD: string;
    HOST: string;
    PORT: number;
  };

  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
  ADMIN:{
    SUPER_ADMIN_NAME:string
    SUPER_ADMIN_EMAIL:string 
SUPER_ADMIN_PASS:string
  }
}

/* ================= ENV LOADER ================= */
const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "DATABASE_URL",

    "JWT_SECRET_ACCESS_TOKEN",
    "JWT_SECRET_REFRESH_TOKEN",
    "JWT_ACCESS_TOKEN_EXPIRES",
    "JWT_REFRESH_TOKEN_EXPIRES",
    "JWT_RESET_PASSWORD_EXPIRES",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_AUTH_CALLBACK_URL",

    "FRONTEND_URL",

    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",

    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "REDIS_HOST",
    "REDIS_PORT",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SUPER_ADMIN_NAME",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASS"
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    DATABASE_URL: process.env.DATABASE_URL as string,

    JWT: {
      JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      JWT_ACCESS_TOKEN_EXPIRES: process.env.JWT_ACCESS_TOKEN_EXPIRES as string,
      JWT_REFRESH_TOKEN_EXPIRES: process.env.JWT_REFRESH_TOKEN_EXPIRES as string,
       JWT_RESET_PASSWORD_EXPIRES:process.env.JWT_RESET_PASSWORD_EXPIRES as string
    },

    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      CALLBACK_URL: process.env.GOOGLE_AUTH_CALLBACK_URL as string,
    },

    FRONTEND_URL: process.env.FRONTEND_URL as string,

    SMTP: {
      HOST: process.env.SMTP_HOST as string,
      PORT: Number(process.env.SMTP_PORT),
      USER: process.env.SMTP_USER as string,
      PASS: process.env.SMTP_PASS as string,
      FROM: process.env.SMTP_FROM as string,
    },

    REDIS: {
      USERNAME: process.env.REDIS_USERNAME as string,
      PASSWORD: process.env.REDIS_PASSWORD as string,
      HOST: process.env.REDIS_HOST as string,
      PORT: Number(process.env.REDIS_PORT),
    },

    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      API_KEY: process.env.CLOUDINARY_API_KEY as string,
      API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    ADMIN:{
      SUPER_ADMIN_NAME:process.env.SUPER_ADMIN_NAME as string ,
      SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
      SUPER_ADMIN_PASS:process.env.SUPER_ADMIN_PASS as string
    }
  };
};

export const envVars = loadEnvVariables();
