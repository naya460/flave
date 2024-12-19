import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getFileData } from "mongo/file/get_data";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    file_id: { type: "string" },
  },
  required: ["file_id"],
} as const;

export const flvGetFileDataSchema = {
  params: paramsSchema,
};

export const flvGetFileDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return null;

  const data = await getFileData(new ObjectId(req.params.file_id));
  if (data === null) {
    res.status(400);
    return;
  }

  if (checkAuth({ workspace: data.workspace.toString() }, req, res) === null) {
    return;
  }

  res.type("application/json");
  return data;
};
