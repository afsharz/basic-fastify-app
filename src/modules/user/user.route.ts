import { FastifyInstance } from "fastify";
import {
  registerUserHandler,
  getUserHandler,
  registerLoginHandler,
} from "./user.controller";
import { register } from "fastify-zod";
import { CreateUserSchema, $ref } from "./user.schema";

const UserRoutes = async (server: FastifyInstance) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    registerLoginHandler
  );

  server.get("/", { preHandler: [server.authenticate] }, getUserHandler);
};

export default UserRoutes;
