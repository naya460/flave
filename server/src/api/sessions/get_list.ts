import { apiHandler } from "lib/fastify";
import { getSessionList } from "mongo/session/get_list";
import { FromSchema } from "json-schema-to-ts";
import { getSession } from "mongo/session/get_session";
import { checkAdminUser } from "mongo/user/check_admin";

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

  res.status(200);
  res.type("application/json");
  return await getSessionList();
};
