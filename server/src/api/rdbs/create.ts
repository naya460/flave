import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createRdb } from "mongo/rdb/create";
import { ObjectId } from "mongodb";

const bodySchema = {
  type: "object",
  properties: {
    workspace: { type: "string" },
  },
  required: ["workspace"],
} as const;

export const flvCreateRdbSchema = {
  body: bodySchema,
};

export const flvCreateRdbHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ workspace: req.body.workspace }, req, res);
  if (auth === null) return;

  const id = await createRdb(
    "New Database",
    new ObjectId(req.body.workspace),
    auth
  );

  if (id === null) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("text/plain");
  return id.toString();
};
