import { fastify } from "fastify";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import ScalarApiRefenre from "@scalar/fastify-api-reference";
import { database } from "@/plugins/database";
import { userModule } from "@/plugins/user.module";

const buildServer = async () => {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Clean Architecture api",
        description: "For study only",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(ScalarApiRefenre, {
    routePrefix: "/docs",
  });

  await app.register(database);
  await app.register(userModule);

  app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
    console.log("HTTP Server Running on http://localhost:3333");
    console.log("Docs runing on http://localhost:3333/docs");
  });
};

buildServer();
