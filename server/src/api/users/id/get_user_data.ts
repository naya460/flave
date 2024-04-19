import { apiHandler } from "lib/fastify";
import { checkAuth } from "api/common/check_auth";
import { getUserData } from "mongo/user/get_data";
import { FromSchema } from "json-schema-to-ts";

const paramsSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
  },
  required: ["user_id"],
} as const;

const replySchema = {
  type: ["object", "null"],
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
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return null;

  res.status(200);
  res.type("application/json");
  return await getUserData(req.params.user_id);
};
