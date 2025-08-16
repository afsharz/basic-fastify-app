import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { access } from "fs";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be string",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
});

const createUserResponseSchema = z.object({
  ...userCore,
  id: z.number(),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be string",
    })
    .email(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserResponseSchema,
  createUserSchema,
  loginSchema,
  loginResponseSchema,
});
