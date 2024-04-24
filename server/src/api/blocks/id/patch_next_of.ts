import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getBlockData } from "mongo/block/get_data";
import { searchBlockData } from "mongo/block/search_data";
import { updateBlock } from "mongo/block/update";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    block_id: { type: "string" },
  },
  required: ["block_id"],
} as const;

const bodySchema = {
  type: "object",
  properties: {
    next_of: { type: ["string", "null"] },
  },
  required: ["next_of"],
} as const;

export const flvPatchBlockNextSchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvPatchBlockNextHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ block: req.params.block_id }, req, res);
  if (auth === null) return null;

  if (req.params.block_id === req.body.next_of) {
    res.status(400);
    return;
  }

  const target_block = await getBlockData(req.params.block_id);
  if (target_block === null) {
    res.status(400);
    return;
  }

  const next_block = await searchBlockData({ next_of: target_block._id });
  if (next_block !== null) {
    await updateBlock(next_block._id.toString(), auth, {
      next_of: target_block.next_of,
    });
  }

  await updateBlock(req.params.block_id, auth, {
    next_of: req.body.next_of === null ? null : new ObjectId(req.body.next_of),
  });

  res.status(200);
  return;
};
