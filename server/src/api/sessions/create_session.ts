import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getUserHash } from "mongo/user/get_hash";
import bcrypt from "bcrypt";

const bodySchema = {
  type: "object",
  properties: {
    auth_id: { type: "string" },
    password: { type: "string" },
  },
  required: ["auth_id", "password"],
} as const;

export const flvCreateSessionSchema = {
  body: bodySchema,
};

export const flvCreateSessionHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth_id = req.body.auth_id;
  const password = req.body.password;

  const hash = await getUserHash(auth_id);
  if (hash === null) {
    res.status(400);
    return;
  }

  const match = await bcrypt.compare(password, hash);
  if (match) {
    res.status(200);
    res.type("application/json");
    return { ok: true };
  } else {
    res.status(400);
    return;
  }
};
