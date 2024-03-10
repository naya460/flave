import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createUser, createUserData } from "mongo/user/create_user";
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

export const flvCreateUserSchema = {
  body: bodySchema,
  response: {
    200: createUserData,
  },
};

export const flvCreateUserHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
  Reply: FromSchema<typeof createUserData>;
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
  if (result.ok === false) {
    res.status(400);
    return;
  }

  res.status(200);
  return result.data;
};
