import { UserCreateInput, UserReturn, UserUpdateInput } from "@/domain/models/user.model";
import { UserRepository } from "@/infrastructure/repositories/user.repository";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: UserCreateInput): Promise<UserReturn> {
    return this.userRepository.create(payload);
  }
}

export class FindAllUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserReturn[]> {
    return this.userRepository.findAll();
  }
}

export class FindUserById {
  constructor(private userRepository: UserRepository) {}

  async execute(id: number): Promise<UserReturn | null> {
    return this.userRepository.findById(id);
  }
}

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(
    id: number,
    payload: UserUpdateInput
  ): Promise<UserReturn | null> {
    return this.userRepository.update(id, payload);
  }
}

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
