import { apiHandler } from "lib/fastify";
import { getSession } from "mongo/session/get_session";
import { checkAdminUser } from "mongo/user/check_admin";
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
  const session = req.cookies.session;
  if (session === undefined) {
    res.status(400);
    return;
  }

  const user_id = (await getSession(session)).user_id;
  const is_admin = await checkAdminUser(user_id);

  if (is_admin === false) {
    res.status(400);
    return;
  }

  res.type("application/json");
  return await getUserList();
};
