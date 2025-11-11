import { UserRepository } from "./user.repository";
import {
  UserCreateInput,
  UserReturn,
  UserUpdateInput,
} from "@/domain/models/user.model";
import { Kysely } from "kysely";
import { Database } from "@/domain/models/database.model";

export class KyselyUserRepository implements UserRepository {
  constructor(private db: Kysely<Database>) {}

  async create(payload: UserCreateInput): Promise<UserReturn> {
    const res = await this.db
      .insertInto("users")
      .values(payload)
      .returning([
        "id",
        "name",
        "email",
        "isActive",
        "role",
        "created_at",
        "updated_at",
      ])
      .execute();
    return res[0];
  }

  async findAll(): Promise<UserReturn[]> {
    return this.db
      .selectFrom("users")
      .select([
        "id",
        "name",
        "email",
        "isActive",
        "role",
        "created_at",
        "updated_at",
      ])
      .where("isActive", "=", true)
      .execute();
  }

  async findById(id: number): Promise<UserReturn | null> {
    return (
      (await this.db
        .selectFrom("users")
        .select([
          "id",
          "name",
          "email",
          "isActive",
          "role",
          "created_at",
          "updated_at",
        ])
        .where("isActive", "=", true)
        .where("id", "=", id)
        .executeTakeFirst()) || null
    );
  }

  async update(
    id: number,
    payload: UserUpdateInput
  ): Promise<UserReturn | null> {
    return (
      (await this.db
        .updateTable("users")
        .set(payload)
        .where("id", "=", id)
        .returning([
          "id",
          "name",
          "email",
          "isActive",
          "role",
          "created_at",
          "updated_at",
        ])
        .executeTakeFirst()) || null
    );
  }

  async delete(id: number): Promise<boolean> {
    return this.db
      .updateTable("users")
      .set({ isActive: false })
      .where("id", "=", id)
      .executeTakeFirst()
      .then(() => true)
      .catch(() => false);
  }
}
