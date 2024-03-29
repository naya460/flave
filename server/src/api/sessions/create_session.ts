import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { checkAuth } from "api/common/check_auth";
import { getUserHash } from "mongo/user/get_hash";
import bcrypt from "bcrypt";
import { createSession } from "mongo/sessions/create_session";

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
  const auth = await checkAuth("auth", req);
  if (auth !== null) {
    res.status(400);
    return;
  }

  const auth_id = req.body.auth_id;
  const password = req.body.password;

  const user = await getUserHash(auth_id);
  if (user === null) {
    res.status(400);
    return;
  }

  const match = await bcrypt.compare(password, user.hash);
  if (match) {
    const session = await createSession(user.id);
    if (session === null) {
      res.status(400);
      return;
    }

    res.status(200);
    res.setCookie("session", session, {
      path: "/",
      httpOnly: true,
      maxAge: 3600,
    });
    return;
  } else {
    res.status(400);
    return;
  }
};
