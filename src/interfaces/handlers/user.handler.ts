import {
  CreateUser,
  DeleteUser,
  FindAllUsers,
  FindUserById,
  UpdateUser,
} from "@/application/useCases/user.case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.email(),
  isActive: z.boolean().default(true),
  password: z.string(),
  role: z.enum(["admin", "user"]).default("user"),
  created_at: z.iso.date(),
  updated_at: z.iso.date(),
});

const userCreateSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

const userUpdateSchema = userCreateSchema.partial();

export class UserHandler {
  constructor(
    private createUserCase: CreateUser,
    private getUserByIdCase: FindUserById,
    private updateUserCase: UpdateUser,
    private deleteUserCase: DeleteUser,
    private getAllUsersCase: FindAllUsers
  ) {}

  async createUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = userCreateSchema.parse(req.body);
      const user = await this.createUserCase.execute(data);
      reply.status(201).send(user);
    } catch (err) {
      reply.code(400).send({
        error: err instanceof Error ? err.message : "Invalid request",
      });
    }
  }

  async getAllUsers(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.getAllUsersCase.execute();
      reply.status(200).send(users);
    } catch (err) {
      reply.code(500).send({
        error: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  }

  async getUserById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return reply.code(400).send({ error: "Invalid user ID format" });
      }

      const user = await this.getUserByIdCase.execute(id);

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return reply.status(200).send(user);
    } catch (err) {
      reply.code(500).send({
        error: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  }

  async updateUser(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return reply.code(400).send({ error: "Invalid user ID format" });
      }

      const data = userUpdateSchema.parse(req.body);
      const user = await this.updateUserCase.execute(id, data);

      if (user) {
        reply.status(200).send(user);
      } else {
        reply.code(404).send({ error: "User not found" });
      }
    } catch (err) {
      reply.code(400).send({
        error: err instanceof Error ? err.message : "Invalid request",
      });
    }
  }

  async deleteUser(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return reply.code(400).send({ error: "Invalid user ID format" });
      }

      const success = await this.deleteUserCase.execute(id);
      reply
        .status(success ? 204 : 404)
        .send(success ? undefined : { error: "User not found" });
    } catch (err) {
      reply.code(500).send({
        error: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  }
}
