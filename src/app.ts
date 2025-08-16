import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import UserRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import fjwt from "@fastify/jwt";

export const server = Fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

server.register(fjwt, {
  secret: "somerandompassword",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);
const main = async () => {
  // for (const schema of [...userSchemas]) server.addSchema(schema);

  server.register(UserRoutes, { prefix: "/api/users" });

  server.register(async (server: FastifyInstance) => {
    server.get("/", (req, res) => {
      res.send("server is responsive");
    });
  });
  try {
    const port = 3000;
    const host = "0.0.0.0";
    await server.listen({ port, host });
    console.log("server starts listening on port 3000");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
main();
