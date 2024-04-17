import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createUser } from "mongo/user/create_user";
import bcrypt from "bcrypt";

const bodySchema = {
  type: "object",
  properties: {
    auth_id: { type: "string" },
    password: { type: "string" },
    confirm_password: { type: "string" },
  },
  required: ["auth_id", "password", "confirm_password"],
} as const;

export const replySchema = {
  type: "object",
  properties: {
    auth_id: { type: "string" },
    name: { type: "string" },
    hash: { type: "string" },
  },
  required: ["auth_id", "name", "hash"],
} as const;

export const flvCreateUserSchema = {
  body: bodySchema,
  response: {
    200: replySchema,
  },
};

export const flvCreateUserHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth_id = req.body.auth_id;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  if (password !== confirm_password) {
    res.status(400);
    return;
  }
  const hash = await bcrypt.hash(password, 10);

  const result = await createUser(auth_id, hash);
  if (result === null) {
    res.status(400);
    return;
  }

  res.status(200);
  return result;
};
