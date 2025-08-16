import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { CreateUserSchema, LoginSchema } from "./user.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";
import { sign } from "crypto";
import fastifyJwt from "@fastify/jwt";

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserSchema;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (error) {
    console.error(` error with this request : ${request} and error:`, error);
    if (error instanceof PrismaClientKnownRequestError)
      return reply
        .code(400)
        .send(`there is a user with the same email: ${body.email}`);
    return reply.code(500).send(error);
  }
};

export const registerLoginHandler = async (
  request: FastifyRequest<{
    Body: LoginSchema;
  }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  // find a user by its email
  const user = await findUserByEmail(email);

  if (!user)
    return reply.code(401).send({
      message: "invalid email or password!",
    });

  const { salt, password: hash, ...rest } = user;
  //verify passwords
  const correctPassword = verifyPassword({
    condidatePassword: password,
    salt,
    hash,
  });

  // generate access token and respond
  if (correctPassword) {
    const accessToken = await reply.jwtSign(rest); // Generate the token
    return reply.send({ accessToken });
  }
  return reply.code(401).send({
    message: "invalid email or password!",
  });
};

export async function getUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const users = await findUsers();
  return users;
}
