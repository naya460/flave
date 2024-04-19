import { apiHandler } from "lib/fastify";
import { checkAuth } from "api/common/check_auth";
import { getSessionList } from "mongo/session/get_list";
import { FromSchema } from "json-schema-to-ts";

const replySchema = {
  type: "array",
  properties: {
    _id: { type: "string" },
    user_id: { type: "string" },
  },
} as const;

export const flvGetSessionListHandler: apiHandler<{
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("admin", req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getSessionList();
};
