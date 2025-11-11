import {
  CreateUser,
  DeleteUser,
  FindAllUsers,
  FindUserById,
  UpdateUser,
} from "@/application/useCases/user.case";
import { KyselyUserRepository } from "@/infrastructure/repositories/kyselyUserRepository";
import { UserHandler } from "@/interfaces/handlers/user.handler";
import { userRoutes } from "@/interfaces/routes";
import { FastifyInstance } from "fastify";

export async function userModule(app: FastifyInstance) {
  const kysely = app.db;
  const userRepository = new KyselyUserRepository(kysely);
  const createUserUseCase = new CreateUser(userRepository);
  const getUserByIdUseCase = new FindUserById(userRepository);
  const updateUserUseCase = new UpdateUser(userRepository);
  const getAllUsersUseCase = new FindAllUsers(userRepository);
  const deleteUserUseCase = new DeleteUser(userRepository);

  const userHandler = new UserHandler(
    createUserUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getAllUsersUseCase
  );

  await userRoutes(app, userHandler);
}
