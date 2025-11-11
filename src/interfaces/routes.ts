import { FastifyInstance } from "fastify";
import { UserHandler } from "./handlers/user.handler";

export async function userRoutes(
  fastify: FastifyInstance,
  handler: UserHandler
) {
  fastify.post("/users", handler.createUser.bind(handler));
  fastify.get("/users", handler.getAllUsers.bind(handler));
  fastify.get("/users/:id", handler.getUserById.bind(handler));
  fastify.put("/users/:id", handler.updateUser.bind(handler));
  fastify.delete("/users/:id", handler.deleteUser.bind(handler));
}
