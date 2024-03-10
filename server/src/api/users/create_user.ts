import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createUser } from "mongo/user/create_user";

const bodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
} as const;

export const flvCreateUserSchema = {
  body: bodySchema,
};

export const flvCreateUserHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const name = req.body.name;
  if (!name) return;
  await createUser(name, name);
  res.status(200);
};
