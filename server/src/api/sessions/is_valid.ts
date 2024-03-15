import { apiHandler, checkAuth } from "lib/fastify";
import { FromSchema } from "json-schema-to-ts";

const replySchema = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
  },
  required: ["ok"],
} as const;

export const flvIsSessionValidHandler: apiHandler<{
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);

  if (auth) {
    res.status(200);
    return { ok: true };
  } else {
    res.status(200);
    return { ok: false };
  }
};
