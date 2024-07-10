import { checkAuth } from "api/common/check_auth";
import { validate_block } from "flave_types/block_type";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getBlockData } from "mongo/block/get_data";
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
    data: { type: "object" },
  },
} as const;

export const flvPatchBlockDataSchema = {
  params: paramsSchema,
};

export const flvPatchBlockDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ block: req.params.block_id }, req, res);
  if (auth === null) return;

  if (req.body.data !== undefined) {
    const data_type = (await getBlockData(req.params.block_id))?.type;
    if (
      data_type !== undefined &&
      validate_block(data_type, req.body.data, false) === false
    ) {
      res.status(400);
      return;
    }
  }

  const doc: {
    next_of?: ObjectId | null;
  } & {
    [key in `data.${string}`]: unknown;
  } = {};
  if (req.body.next_of !== undefined) {
    doc.next_of =
      req.body.next_of === null ? null : new ObjectId(req.body.next_of);
  }
  if (req.body.data !== undefined) {
    for (const [key, value] of Object.entries(req.body.data)) {
      doc[`data.${key}`] = value;
    }
  }

  await updateBlock(req.params.block_id, auth, doc);
};
