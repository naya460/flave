import { apiHandler, checkAuth } from "lib/fastify";
import { getUserList } from "mongo/user/get_list";
import { FromSchema } from "json-schema-to-ts";

const replySchema = {
  type: "array",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    auth_id: { type: "string" },
    admin: { type: "boolean" },
  },
  required: ["_id", "name", "auth_id"],
} as const;

export const flvGetUserListHandler: apiHandler<{
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("admin", req, res);
  if (auth === null) return;

  res.type("application/json");
  return await getUserList();
};
