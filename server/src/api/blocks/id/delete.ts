import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { deleteBlock } from "mongo/block/delete";

const paramsSchema = {
  type: "object",
  properties: {
    block_id: { type: "string" },
  },
  required: ["block_id"],
} as const;

export const flvDeleteBlockSchema = {
  params: paramsSchema,
};

export const flvDeleteBlockHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ block: req.params.block_id }, req, res);
  if (auth === null) return null;

  const result = await deleteBlock(req.params.block_id, auth);

  if (result === false) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("application/json");
};
