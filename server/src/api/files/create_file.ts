import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createFile } from "mongo/file/create";
import { ObjectId } from "mongodb";

const bodySchema = {
  type: "object",
  properties: {
    workspace_id: { type: "string" },
    type: { type: "string" },
    data: { type: "string" },
  },
  required: ["workspace_id", "type", "data"],
} as const;

export const flvCreateFileSchema = {
  body: bodySchema,
};

export const flvCreateFileHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ workspace: req.body.workspace_id }, req, res);
  if (auth === null) return;

  if (req.body.type !== "image") {
    res.status(400);
    return;
  }

  const id = await createFile(
    new ObjectId(req.body.workspace_id),
    req.body.type,
    req.body.data
  );
  if (id === null) {
    res.status(400);
    return;
  }

  res.type("text/plain");
  return id.toString();
};
