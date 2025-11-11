import { UserCreateInput } from "@/domain/models/user.model";
import type { Kysely } from "kysely";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { hashSync, genSalt } from "bcryptjs";
import { Database } from "@/domain/models/database.model";

export async function seed(db: Kysely<Database>): Promise<void> {
  // 1. Limpa a tabela antes de popular
  await db.deleteFrom("users").execute();

  // 2. Cria um array de usuários falsos
  const users: UserCreateInput[] = [];

  for (let i = 0; i < 20; i++) {
    const createdAt = faker.date.past(); // Gera uma data no passado
    const salts = await genSalt();
    const person = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    users.push({
      name: `${person.firstName} ${person.lastName}`,
      email: faker.internet
        .email({
          firstName: person.firstName,
          lastName: person.lastName,
        })
        .toLowerCase(), // Emails
      isActive: faker.datatype.boolean(),
      role: faker.helpers.arrayElement(["admin", "user"] as const),

      password: hashSync("123456", salts),

      // Converte as datas para o formato ISO string, como seu model espera
      created_at: createdAt.toISOString(),
      updated_at: faker.date.recent().toISOString(), // Uma data mais recente
    });
  }

  // Bônus: Adicionar um usuário admin conhecido para testes
  users.push({
    name: "Admin de Teste",
    email: "admin@teste.com",
    isActive: true,
    role: "admin",
    password: hashSync("admin123", 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // 3. Insere os usuários no banco
  await db.insertInto("users").values(users).execute();
}
