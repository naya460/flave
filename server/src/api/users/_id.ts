import { apiHandler, checkAuth } from "lib/fastify";
import { getUserData } from "mongo/user/get_user_data";
import { FromSchema } from "json-schema-to-ts";

const paramsSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
  },
  required: ["user_id"],
} as const;

const replySchema = {
  type: "array",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
} as const;

export const flvGetUserDataSchema = {
  params: paramsSchema,
  reply: replySchema,
};

export const flvGetUserDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getUserData(req.params.user_id);
};
