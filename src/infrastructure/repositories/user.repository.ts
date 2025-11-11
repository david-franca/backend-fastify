import {
  UserCreateInput,
  UserReturn,
  UserUpdateInput,
} from "@/domain/models/user.model";

export interface UserRepository {
  create(payload: UserCreateInput): Promise<UserReturn>;
  findAll(): Promise<UserReturn[]>;
  findById(id: number): Promise<UserReturn | null>;
  update(id: number, payload: UserUpdateInput): Promise<UserReturn | null>;
  delete(id: number): Promise<boolean>;
}
